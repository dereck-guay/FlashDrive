<x-app-layout>

    <div>
        <x-card>
            <div class="flex gap-x-4 mb-2 items-center">
                <button class="btn btn-primary btn-insert">
                    <i class="fa-solid fa-plus-circle"></i>
                    Create Module
                </button>
                <div class="bg-blue-100 text-slate-600 border rounded px-4 py-1">
                    <i class="fa-solid fa-bell mr-1"></i>
                    Changes made will only be applied after reloading the page.
                </div>
            </div>
            <div class="modules_dg_container overflow-y-auto" style="max-height: 520px;"></div>
        </x-card>
    </div>

    <div class="mt-2">
        <x-card>
            <div class="modules_df_container flex flex-wrap items-center">
                <div class="module_title basis-1/3 p-2"></div>
                <div class="module_icon basis-1/3 p-2"></div>
                <div class="module_color basis-1/3 p-2"></div>
                <div class="module_route_name basis-1/3 p-2"></div>
                <div class="module_path basis-1/3 p-2"></div>
                <div class="module_endpoint basis-1/3 p-2"></div>
                <div class="flex items-center justify-center gap-x-2 p-2">
                    <button class="btn btn-primary p-2 btn-save">
                        <i class="fa-solid fa-plus-circle"></i>
                        Save
                    </button>
                    <button class="btn btn-secondary btn-cancel">
                        <i class="fa-solid fa-ban"></i>
                        Cancel
                    </button>
                </div>
            </div>
        </x-card>
    </div>

    <x-slot name="scripts">
        <script>
            "use strict";

            let btnInsert = document.querySelector('.btn-insert');
            let btnSave = document.querySelector('.btn-save');
            let btnCancel = document.querySelector('.btn-cancel');

            btnInsert.onclick = e => {
                module_ds.insert();
            };
            btnSave.onclick = async e => {
                await module_ds.save();
                location.reload();
            };
            btnCancel.onclick = e => {
                module_ds.cancel();
            };

            let module_ds = new Dataset({
                model: 'Module',
                records: JSON.parse(`{!! \App\Models\Module::all()->toJson() !!}`),
            });

            let module_dg = new DataGrid({
                dataset: module_ds,
                containerElement: document.querySelector('.modules_dg_container'),
                structure: {
                    columns: [
                        {
                            cellClass: 'content-width bg-slate-100',
                            headerClass: 'content-width',
                            title: 'ID',
                            field: 'id'
                        },
                        {
                            title: 'Module',
                            field: 'title'
                        },
                        {
                            title: 'Icon',
                            field: 'icon',
                            display: (td, record, dataset) => {
                                td.innerHTML += `<i class="${record.get('icon')} w-8"></i> ${record.get('icon')}`;
                            }
                        },
                        {
                            title: 'Color',
                            field: 'color',
                            display: (td, record, dataset) => {
                                td.innerHTML += `
                                    <div class="flex items-center gap-x-2">
                                        <span class="border inline-block rounded-full bg-${record.get('color')} w-3 h-3"></span>
                                        ${record.get('color')}
                                    </div>
                                `;
                            }
                        },
                        {
                            title: 'Route',
                            field: 'route_name'
                        },
                        {
                            title: 'Path',
                            field: 'path'
                        },
                        {
                            title: 'Endpoint',
                            field: 'endpoint'
                        },
                        {
                            cellClass: 'content-width bg-slate-100',
                            display: (td, record, dataset) => {
                                let deleteBtn = document.createElement('button');
                                deleteBtn.className = 'btn btn-danger';
                                deleteBtn.innerHTML += '<i class="fa-solid fa-trash-alt"></i>';

                                deleteBtn.onclick = async e => {
                                    await dataset.delete(record.get('id'));
                                    location.reload();
                                }

                                td.append(deleteBtn);
                            }
                        }
                    ]
                }
            });

            let title_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_title'),
                edit: 'title',
                label: 'Title',
                settings: {
                    placeholder: 'Module display Name',
                }
            });

            let icon_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_icon'),
                edit: 'icon',
                label: 'Icon',
                settings: {
                    placeholder: 'Module icon',
                }
            });

            let color_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_color'),
                edit: 'color',
                label: 'Color',
                settings: {
                    placeholder: 'Module theme color',
                }
            });

            let route_name_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_route_name'),
                edit: 'route_name',
                label: 'Route',
                settings: {
                    placeholder: 'Module route name',
                }
            });

            let path_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_path'),
                edit: 'path',
                label: 'Path',
                settings: {
                    placeholder: 'Module URL path',
                }
            });

            let endpoint_df = new DataField({
                dataset: module_ds,
                containerElement: document.querySelector('.module_endpoint'),
                edit: 'endpoint',
                label: 'Endpoint',
                settings: {
                    placeholder: 'Module controller endpoint',
                }
            });
        </script>
    </x-slot>

</x-app-layout>
