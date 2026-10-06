<template>
  <NuxtLayout name="main">
    <div
      class="flex flex-col h-full items-center justify-center max-w-[440px] w-full mx-auto"
    >
      <h1 class="font-hector text-[32px] uppercase">
        {{ $t("generating.title") }}
      </h1>

      <div class="flex flex-col mt-[38px] gap-1 max-w-[440px] w-full">
        <Select
          :model-value="selectedLabel"
          :options="revisionLabels"
          :placeholder="$t('generating.select_revision')"
          @update:model-value="onSelectRevisionLabel"
        />

        <template v-for="field in formFields" :key="field.name">
          <Select
            v-if="field.type === 'enum' && field.options?.length"
            v-model="form[field.name]"
            :options="field.options"
            :placeholder="fieldLabel(field)"
          />
          <Input
            v-else
            v-model="form[field.name]"
            :placeholder="fieldLabel(field)"
            :type="inputType(field)"
          />
        </template>
      </div>

      <p v-if="error" class="text-negative text-sm mt-3 text-center">{{ error }}</p>

      <Button
        class="mt-8 w-full"
        color="white"
        text-color="dark"
        :loading="loading"
        :disabled="!selectedName || loading"
        :on-click="onGenerate"
      >
        {{ loading ? $t("generating.generating") : $t("generating.generate") }}
      </Button>

      <div v-if="result?.barcodes?.length" class="mt-6 w-full flex flex-col gap-3">
        <p class="font-semibold">{{ $t("generating.result") }}</p>
        <img
          v-for="b in result.barcodes"
          :key="b.generationId || b.url"
          :src="b.url"
          :alt="b.format"
          class="w-full rounded-[12px] bg-bg-secondary"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

import Select from "~/shared/ui/Select.vue";
import Input from "~/shared/ui/Input.vue";
import Button from "~/shared/ui/Button.vue";
import { getBarcodeGenerationService } from "~/shared/api";
import { useBarcodeGenerationStore } from "~/shared/store";
import type {
  RevisionListItem,
  RevisionSchema,
  RevisionFieldSchema,
  GenerateResult,
} from "~/shared/api/types";

const service = getBarcodeGenerationService();
const store = useBarcodeGenerationStore();

const revisions = ref<RevisionListItem[]>([]);
const selectedName = ref<string | null>(null);
const selectedLabel = ref<string | null>(null);
const schema = ref<RevisionSchema | null>(null);
const form = reactive<Record<string, any>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<GenerateResult | null>(null);

const revisionLabels = computed(() =>
  revisions.value.map(r => r.displayName || r.name)
);

// Показываем только поля, которые не генерируются derive-цепочкой.
const formFields = computed<RevisionFieldSchema[]>(() => {
  const generated = new Set(schema.value?.generatedFields || []);
  return (schema.value?.fields || [])
    .filter(f => !generated.has(f.name))
    .sort((a, b) => a.order - b.order);
});

function fieldLabel(field: RevisionFieldSchema): string {
  return field.required ? `${field.label} *` : field.label;
}

function inputType(field: RevisionFieldSchema): string {
  if (field.type === "date") return "date";
  if (field.type === "number") return "number";
  return "text";
}

onMounted(async () => {
  try {
    const res = await service.listRevisions();
    revisions.value = res.data.revisions || [];
    if (revisions.value.length > 0) {
      await loadRevision(revisions.value[0].name);
    }
  } catch (e: any) {
    error.value = e.message || "Failed to load revisions";
  }
});

function onSelectRevisionLabel(label: string | null) {
  if (!label) return;
  const found = revisions.value.find(r => (r.displayName || r.name) === label);
  if (found) loadRevision(found.name);
}

async function loadRevision(name: string) {
  selectedName.value = name;
  const item = revisions.value.find(r => r.name === name);
  selectedLabel.value = item ? item.displayName || item.name : name;
  result.value = null;
  error.value = null;
  try {
    const res = await service.getSchema(name);
    schema.value = res.data;
    store.setSchema(res.data);
    for (const key of Object.keys(form)) delete form[key];
    for (const field of formFields.value) {
      form[field.name] = field.fallbackValue ?? "";
    }
  } catch (e: any) {
    schema.value = null;
    error.value = e.message || "Failed to load schema";
  }
}

// date → MMDDYYYY (формат DBB, ожидаемый BarcodeGen); прочие — как есть.
function toEngineDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? `${m[2]}${m[3]}${m[1]}` : value;
}

function buildFields(): Record<string, any> {
  const out: Record<string, any> = {};
  for (const field of formFields.value) {
    const raw = form[field.name];
    if (raw === undefined || raw === null || raw === "") continue;
    out[field.name] = field.type === "date" ? toEngineDate(String(raw)) : raw;
  }
  return out;
}

async function onGenerate() {
  if (!selectedName.value || loading.value) return;
  loading.value = true;
  error.value = null;
  result.value = null;
  try {
    const cleaned = buildFields();

    // 1) prepare — stateless черновик (derive-цепочка без billing/render).
    let prepared: Record<string, any> = cleaned;
    try {
      const prep = await service.prepare(selectedName.value, cleaned);
      prepared = prep.data.draftFields || cleaned;
    } catch {
      // prepare может быть недоступен для профиля — тогда auto-режим ниже.
    }

    // 2) generate mode=prepared — billing + render + history.
    const res = await service.generate({
      revision: selectedName.value,
      fields: prepared,
      mode: "prepared",
      units: 1,
      confirmed: true,
    });
    result.value = res.data;
    store.addBarcodes(selectedName.value, res.data.barcodes || []);
  } catch (e: any) {
    error.value = e.message || "Generation failed";
  } finally {
    loading.value = false;
  }
}
</script>
