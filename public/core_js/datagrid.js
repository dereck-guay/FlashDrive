class DataGrid extends DatasetComponent {
    constructor(params) {
        super(params.dataset, params.containerElement);

        // Private Properties
        this._tableElement = undefined;
        this._toolbarElement = undefined;
        this._headElement = undefined;
        this._bodyElement = undefined;
        this._footElement = undefined;
        this._structure = params.structure;
        this._isPrepend = params.isPrepend || false;

        // Callbacks
        this.onRowClicked = params.onRowClick;
        this.onRowDblClick = params.onRowDblClick;

        // Loading
        this.initialize();
    }

    // Datagrid Events
    onRowClick(rowClicked) {
        let recordId = rowClicked.getAttribute('dataset-record-id');
        this.dataset.setPosition(recordId);

        if (this.onRowClicked instanceof Function) this.onRowClicked();
    }

    // Dataset Events
    datasetOnPositionChange(dto) {
        if (dto.position == undefined) return;
        this._select(dto.position);
    }

    datasetOnValueChange(dto) {
        let { field, record } = dto;
        let cellToReplace = document.querySelector(`tr[dataset-record-id="${record.id}"] td[dataset-record-field="${field}"]`);
        if (cellToReplace == undefined) return;

        let column = this._structure.columns.find(c => c.field == field);
        let newCell = this._buildCell(column, record);
        cellToReplace.replaceWith(newCell);
    }

    datasetOnInsert(dto) {
        let newRow = this._buildRow(dto.record);

        if (this._isPrepend) {
            this._bodyElement.prepend(newRow);
            return;
        }

        this._bodyElement.append(newRow);
    }

    datasetOnDelete(dto) {
        let recordId = dto.record.get('id');
        let rowToDelete = document.querySelector(`tr[dataset-record-id="${recordId}"]`);
        rowToDelete.remove();
    }

    //Public Methods
    render() {
        if (this._structure == undefined) return;
        let { toolbar, columns, footer } = this._structure;

        this._tableElement = this._buildTable();
        this._headElement = this._buildThead();
        this._bodyElement = this._buildBody();

        this._tableElement.append(
            this._headElement,
            this._bodyElement
        );

        this.containerElement.innerHTML = '';
        this.containerElement.append(this._tableElement);
    }

    // Private Methods
    _buildTable() {
        let { tableClass, tableCss } = this._structure;
        let tableElement = document.createElement('table');

        // Table Class
        if ( tableClass instanceof Function) tableElement.className = tableClass(dataset);
        else if (typeof(tableClass) == 'string') tableElement.className = tableClass;

        // Table Css
        if ( tableCss instanceof Function) tableElement.style = tableCss(dataset);
        else if (typeof(tableCss) == 'string') tableElement.style = tableCss;

        tableElement.classList.add('datagrid');
        return tableElement;
    }

    _buildThead() {
        let { columns } = this._structure;
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');

        for (let { title, headerClass, headerCss, selectable } of columns) {
            let th = document.createElement('th');

            // th Class
            if ( headerClass instanceof Function) th.className = headerClass(dataset);
            else if (typeof(headerClass) == 'string') th.className = headerClass;

            // th Css
            if ( headerCss instanceof Function) th.style = headerCss(dataset);
            else if (typeof(headerCss) == 'string') th.style = headerCss;

            if (selectable) {
                let allCheckbox = document.createElement('input');
                allCheckbox.type = 'checkbox';
                allCheckbox.onclick = e => this._checkAll(e.target.checked);
                th.append(allCheckbox);
                tr.append(th);
                continue;
            }

            if (title instanceof Function) {
                let titleResult = title(th, this.dataset, this);
                if (titleResult != undefined) td.innerHTML = titleResult;
                tr.append(th);
                continue;
            }

            th.innerHTML = title || '';

            tr.append(th);
        }

        thead.append(tr);
        thead.classList.add('datagrid_head');
        return thead;
    }

    _buildBody() {
        let tbody = document.createElement('tbody');
        let records = this.dataset.getAllRecords();
        for (let recordId in records)
            tbody.append(this._buildRow(records[recordId]));


        tbody.classList.add('datagrid_body');
        return tbody;
    }

    _buildRow(record) {
        let { columns, rowClass, rowCss } = this._structure;
        let tr = document.createElement('tr');

        tr.setAttribute('dataset-record-id', record[this.dataset.primaryKey]);
        tr.addEventListener('click', e => this.onRowClick(e.currentTarget));
        tr.addEventListener('dblclick', e => {
            if (this.onRowDblClick instanceof Function) this.onRowDblClick(e);
        });

        // tr Class
        if ( rowClass instanceof Function) tr.className = rowClass(dataset);
        else if (typeof(rowClass) == 'string') tr.className = rowClass;

        // tr Css
        if ( rowCss instanceof Function) tr.style = rowCss(dataset);
        else if (typeof(rowCss) == 'string') tr.style = rowCss;

        for (let column of columns)
            tr.append(this._buildCell(column, record));

        return tr;
    }

    _buildCell(column, record) {
        let { field, name, cellClass, cellCss, display, format, selectable } = column;
        let td = document.createElement('td');

        td.setAttribute('dataset-record-field', field || name);

        // td Class
        if ( cellClass instanceof Function) td.className = cellClass(dataset);
        else if (typeof(cellClass) == 'string') td.className = cellClass;

        // td Css
        if ( cellCss instanceof Function) td.style = cellCss(dataset);
        else if (typeof(cellCss) == 'string') td.style = cellCss;

        if (selectable) {
            td.setAttribute('dataset-record-field', 'selectable');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            td.append(checkbox);
            return td;
        }

        if (display instanceof Function) {
            let displayResult = display(td, record, this.dataset, this);
            if (displayResult != undefined) td.innerHTML = displayResult;
        } else if (typeof(display) == 'string') td.innerHTML = display;
        if (display != undefined) return td;

        td.innerHTML = record.get(field, format);

        return td;
    }

    _select(recordId) {
        let selectedRows = this._bodyElement.querySelectorAll('.datagrid_selected');
        for (let selectedRow of selectedRows) selectedRow.classList.remove('datagrid_selected');
        let rowToSelect = this._bodyElement.querySelector(`tr[dataset-record-id="${recordId}"]`);
        rowToSelect.classList.add('datagrid_selected');
    }

    _checkAll(isChecked) {
        console.log()
        let checkboxes = this.containerElement.querySelectorAll('td[dataset-record-field="selectable"] input[type="checkbox"]');
        for (let checkbox of checkboxes)
            checkbox.checked = isChecked;
    }
}
