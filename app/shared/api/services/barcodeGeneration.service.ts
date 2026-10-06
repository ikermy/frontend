/**
 * Barcode Generation Service
 * Unified BFF generate flow: revisions → schema → prepare → generate (ПЛАН §3.3).
 */

import { getApiClient } from "../client";
import type {
  ApiResponse,
  RevisionSchema,
  RevisionListItem,
  PrepareResult,
  GenerateResult,
} from "../types";

export type GenerationMode = "auto" | "prepared";

export interface GeneratePayload {
  revision: string;
  fields: Record<string, any>;
  mode?: GenerationMode;
  units?: number;
  barcodeType?: string;
  buildId?: string;
  batchId?: string;
  confirmed?: boolean;
}

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class BarcodeGenerationService {
  private client = getApiClient();

  /** GET /api/v1/revisions — доступные (enabled) профили. */
  async listRevisions(): Promise<ApiResponse<{ revisions: RevisionListItem[] }>> {
    if (this.client.getMode() === "mock") {
      return {
        data: {
          revisions: [
            { name: "US_CA_08292017", displayName: "California Driver License (Aug 2017)", enabled: true },
          ],
        },
      };
    }
    return this.client.get<{ revisions: RevisionListItem[] }>("/revisions");
  }

  /** GET /api/v1/revisions/:revision/schema — схема формы профиля. */
  async getSchema(revision: string): Promise<ApiResponse<RevisionSchema>> {
    if (this.client.getMode() === "mock") {
      return {
        data: {
          revision,
          displayName: revision,
          revisionEffectiveDate: "2017-08-29",
          supportedModes: ["prepare", "auto", "prepared"],
          baseInput: ["firstName", "lastName", "dateOfBirth"],
          generatedFields: ["DBD", "DBA", "DAQ", "DCK", "DCF"],
          fields: [
            { name: "firstName", type: "string", required: true, label: "First Name", order: 1 },
            { name: "lastName", type: "string", required: true, label: "Last Name", order: 2 },
            { name: "dateOfBirth", type: "date", required: true, label: "Date of Birth", order: 3 },
          ],
          groups: [],
        },
      };
    }
    return this.client.get<RevisionSchema>(
      `/revisions/${encodeURIComponent(revision)}/schema`
    );
  }

  /** POST /api/v1/barcode/prepare — stateless черновик (без billing). */
  async prepare(
    revision: string,
    fields: Record<string, any>
  ): Promise<ApiResponse<PrepareResult>> {
    if (this.client.getMode() === "mock") {
      return {
        data: { success: true, revision, draftFields: fields, computed: [], skipped: [] },
      };
    }
    return this.client.post<PrepareResult>("/barcode/prepare", { revision, fields });
  }

  /**
   * POST /api/v1/barcode/generate — unified generate (billing + render + history).
   * Требует заголовок X-Idempotency-Key (п.14.1 ТЗ).
   */
  async generate(payload: GeneratePayload): Promise<ApiResponse<GenerateResult>> {
    if (this.client.getMode() === "mock") {
      const now = Date.now();
      return {
        data: {
          success: true,
          buildId: payload.buildId || String(now),
          barcodes: [
            {
              url: `https://placehold.co/600x200?text=PDF417+${encodeURIComponent(payload.revision)}`,
              format: "pdf417",
              generationId: `mock-${now}`,
            },
          ],
          computed: [],
          skipped: [],
          billing: { totalCost: 0, unitPrice: 0, currency: "USD" },
        },
      };
    }

    const key = newIdempotencyKey();
    return this.client.request<GenerateResult>(
      "/barcode/generate",
      {
        method: "POST",
        body: JSON.stringify({
          revision: payload.revision,
          barcodeType: payload.barcodeType || "pdf417",
          units: payload.units ?? 1,
          confirmed: payload.confirmed ?? true,
          buildId: payload.buildId,
          batchId: payload.batchId,
          mode: payload.mode || "auto",
          fields: payload.fields,
        }),
        headers: { "X-Idempotency-Key": key },
      },
      "bff"
    );
  }
}

let instance: BarcodeGenerationService | null = null;

export function getBarcodeGenerationService(): BarcodeGenerationService {
  if (!instance) {
    instance = new BarcodeGenerationService();
  }
  return instance;
}
