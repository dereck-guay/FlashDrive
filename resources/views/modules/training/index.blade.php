<x-app-layout>
    <div class="py-4">
        <x-card>
            <div>
                <div>Trainings</div>
                <div class="training_dg_container"></div>
            </div>
        </x-card>
    </div>

    <x-slot name="scripts">
        <script>
            "use strict";

            let training_ds = new Dataset({
                model: 'Training'
            });

            let training_dg = new DataGrid({
                dataset: training_ds,
                containerElement: document.querySelector('.training_dg_container'),
                structure: {
                    theadClass: 'text-white bg-gradient-to-br from-orange-400 to-orange-600',
                    columns: [
                        {
                            title: 'Date',
                            field: 'trained_at',
                            format: 'cuteDate'
                        }
                    ],
                }
            });
        </script>
    </x-slot>
</x-app-layout>
