<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"  crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('chart.js/dist/chart.umd.js') }}"></script>
<script src="{{ asset('fullcalendar.js/main.js') }}"></script>
<script src="{{ asset('core_js/formatting.js') }}"></script>
<script src="{{ asset('core_js/helpers.js') }}"></script>
<script src="{{ asset('core_js/validation.js') }}"></script>
<script src="{{ asset('core_js/record.js') }}"></script>
<script src="{{ asset('core_js/dataset.js') }}"></script>
<script src="{{ asset('core_js/datasetcomponent.js') }}"></script>
<script src="{{ asset('core_js/datagrid.js') }}"></script>
<script src="{{ asset('core_js/dataform.js') }}"></script>
<script src="{{ asset('core_js/datacalendar.js') }}"></script>
<script src="{{ asset('core_js/datachart.js') }}"></script>
<script src="{{ asset('core_js/fields/types/datasetfield.js') }}"></script>
<script src="{{ asset('core_js/fields/types/text.field.js') }}"></script>
<script src="{{ asset('core_js/fields/types/select.field.js') }}"></script>
<script src="{{ asset('core_js/fields/datafield.js') }}"></script>
<script>
    window.csrfToken = document.querySelector('[name="csrf-token"]').content;
    window.userObj = new Record(JSON.parse(document.querySelector('[name="user-json"]').content));
</script>
