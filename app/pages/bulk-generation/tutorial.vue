<template>
    <div class="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black" @click="handleClose"></div>

        <!-- Modal Content -->
        <div :class="[
            'bg-bg-secondary flex flex-col overflow-y-auto relative z-10',
            isMobile
                ? 'w-full h-full rounded-t-[24px] p-6'
                : 'w-[50vw] max-w-[50vw] h-[95vh] max-h-[95vh] rounded-[24px] p-6 md:p-8'
        ]">
            <!-- Header with Close Button -->
            <div class="flex items-start justify-between mb-6 flex-shrink-0">
                <h3 class="font-semibold text-2xl text-white">
                    Tutorial
                </h3>
                <button @click="handleClose"
                    class="w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors flex-shrink-0">
                    <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-white" />
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto pr-2">
                <div class="flex flex-col gap-6 text-white max-w-4xl">
                    <!-- What is the Bulk Barcode Generator? -->
                    <div class="flex flex-col gap-3">
                        <h4 class="text-lg font-semibold">
                            What is the Bulk Barcode Generator?
                        </h4>
                        <p class="text-sm leading-relaxed text-text-tertiary">
                            The Bulk Barcode Generator by BarcodeGPT.ai is a tool that allows you to create hundreds
                            of barcodes in one go. This eliminates the need to generate barcodes manually, saving
                            you time and effort.
                        </p>
                    </div>

                    <!-- Why use it? -->
                    <div class="flex flex-col gap-3">
                        <h4 class="text-lg font-semibold">
                            Why use it?
                        </h4>
                        <ul
                            class="text-sm leading-relaxed text-text-tertiary flex flex-col gap-2 list-disc list-inside">
                            <li>⏱️ Save Time: Quickly generate hundreds of barcodes in minutes.</li>
                            <li>🔄 Automation: Simplify repetitive tasks and boost efficiency.</li>
                            <li>📊 Handle Large Data Easily: Perfect for businesses of any size.</li>
                        </ul>
                    </div>

                    <!-- How to Prepare an .XLS File for Barcode Generation -->
                    <div class="flex flex-col gap-3">
                        <h4 class="text-lg font-semibold">
                            How to Prepare an .XLS File for Barcode Generation
                        </h4>
                        <p class="text-sm leading-relaxed text-text-tertiary mb-2">
                            The Bulk Barcode Generator supports bulk data uploads in the .XLS format. Follow these
                            steps to ensure your file is ready:
                        </p>
                        <ol
                            class="text-sm leading-relaxed text-text-tertiary flex flex-col gap-4 list-decimal list-inside">
                            <li class="flex flex-col gap-1">
                                <span class="font-semibold">Create a Table:</span>
                                <ul class="list-disc list-inside ml-4 flex flex-col gap-1">
                                    <li>Include essential fields such as product name, barcode, and category (if
                                        needed).</li>
                                    <li>Ensure each entry has unique values.</li>
                                </ul>
                            </li>
                            <li class="flex flex-col gap-1">
                                <span class="font-semibold">Check Formatting:</span>
                                <ul class="list-disc list-inside ml-4 flex flex-col gap-1">
                                    <li>Verify there are no blank rows or errors in your data.</li>
                                    <li>Make sure all data is placed in the correct columns.</li>
                                </ul>
                            </li>
                            <li class="flex flex-col gap-1">
                                <span class="font-semibold">Save as .XLS File:</span>
                                <ul class="list-disc list-inside ml-4 flex flex-col gap-1">
                                    <li>Make sure all data is placed in the correct columns.</li>
                                </ul>
                            </li>
                        </ol>
                        <p class="text-sm leading-relaxed text-text-tertiary mt-2">
                            Once your file is ready, upload it into the Bulk Barcode Generator and let the tool
                            handle the rest!
                        </p>
                    </div>

                    <!-- Why Choose BarcodeGPT.ai? -->
                    <div class="flex flex-col gap-3">
                        <h4 class="text-lg font-semibold">
                            Why Choose BarcodeGPT.ai?
                        </h4>
                        <p class="text-sm leading-relaxed text-text-tertiary mb-2">
                            With our Bulk Barcode Generator, you'll benefit from:
                        </p>
                        <ul
                            class="text-sm leading-relaxed text-text-tertiary flex flex-col gap-2 list-disc list-inside">
                            <li>🛠 User-Friendly Interface: Designed for both beginners and professionals.</li>
                            <li>⚙️ Flexible Barcode Settings: Customizable to suit your needs.</li>
                            <li>📈 Business Scalability: Ideal for small startups or large enterprises.</li>
                        </ul>
                        <p class="text-sm leading-relaxed text-text-tertiary mt-2">
                            This refined text is clear, concise, and user-focused, ensuring an intuitive experience
                            for your audience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
const isMobile = ref(false);

onMounted(() => {
    const checkMobile = () => {
        isMobile.value = window.innerWidth < 768;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    onUnmounted(() => {
        window.removeEventListener("resize", checkMobile);
    });
});

const handleClose = () => {
    router.push('/bulk-generation');
};
</script>
