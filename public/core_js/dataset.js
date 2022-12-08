class Dataset {
    initialize(records) {
        this._records = [];
        for (let record of records)
            this._records.push(new Record(record, this));

        this.setStatus('browse');
        this._propagateEvent('OnReady');
    }

    constructor(params) {
        // Public Properties
        this.model = params.model;
        this.instanceName = params.instanceName || `${this.model.toLowerCase()}_ds`;
        this.primaryKey = params.primaryKey || 'id';
        this.relation = params.relation || {};

        // Private Properties
        this._bindings = [];
        this._editPool = { };
        this._records = params.records;
        this._childComponents = [];
        this._status = 'load';
        this._lastPosition = undefined;
        this._position = undefined;
        this._filters = { };
        this._ajaxHeaders = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': window.csrfToken,
            'Content-Type': 'Application/json',
            'Access-Control-Allow-Methods' : 'POST',
            'Access-Control-Allow-Headers' : 'X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization'

        };

        // Loading
        if (params.records != undefined) {
            this.initialize(params.records);
            return;
        }

        this._loadData();
    }

    // Record Events
    onRecordChange(record, field, newValue) {
        this.setStatus('edit');

        let baseRecord = record.record;
        let oldValue = baseRecord[field];

        if (this._editPool[record.id] == undefined)
            this._editPool[record.id] = baseRecord;

        this._propagateEvent('OnValueChange', {
            field: field,
            oldValue: oldValue,
            newValue: newValue,
            record: record,
        });
    }

    // Public Methods
    refreshNofetch() {
        this._propagateEvent('OnReady');
    }

    refresh() {
        return this._loadData();
    }

    cancel() {
        this._cancel();
    }

    insert(insertData) {
        return this._insert(insertData);
    }

    delete(recordId) {
        this._delete(recordId);
    }

    save() {
        this._save();
    }

    setPosition(recordId) {
        if (! recordId in this._records) return;
        if (recordId == this._position) return;

        this._lastPosition = this._position;
        this._position = recordId;
        this._propagateEvent('OnPositionChange', {
            oldPosition: this._lastPosition,
            position: recordId,
            record: this.getRecord(),
        });
    }

    getPosition() {
        return this._position;
    }

    getRecord(recordId) {
        if (recordId == undefined && this._position == undefined) return;
        if (recordId == undefined) recordId = this._position;
        return this._records.find(r => r[this.primaryKey] == recordId);
    }

    getAllRecords() {
        return this._records;
    }

    addChildComponent(component) {
        this._childComponents.push(component);
        if (this.isStatus('load')) return;
        if (component.datasetOnReady instanceof Function)
            component.datasetOnReady({ dataset: this});

    }

    setStatus(newStatus) {
        this._status = newStatus;
        this._propagateEvent('OnStatusChange');
    }

    isStatus(statusToCheck) {
        return this._status == statusToCheck;
    }

    updateBindings() {
        let record = this.getRecord();
        if (this.getRecord() == undefined) return;
        for (let binding of this._bindings) {
            let { bindingElement, field, format, recordId } = binding;
            if (window[format] instanceof Function) {
                window[format]({
                    ...binding,
                    record: record || this.getRecord(recordId)
                });
                continue;
            }

            bindingElement.innerHTML = recordId == undefined
                ? record.get(field, format)
                : this.getRecord(recordId).get(field, format);
        }
    }

    // Private Methods
    _cancel() {
        if (! this.isStatus('edit')) return;
    }

    _detectBindings() {
        let bindingElements = document.querySelectorAll(`[dataset-bind="${this.instanceName}"]`);

        this._bindings = [];
        for (let be of bindingElements)
            this._bindings.push({
                bindingElement: be,
                field: be.getAttribute('dataset-field'),
                format: be.getAttribute('dataset-format'),
                recordId: be.getAttribute('dataset-record-id')
            });
    }

    async _loadData() {
        let loadRes = await fetch('/dataset/list', {
            method: 'POST',
            headers: this._ajaxHeaders,
            body: JSON.stringify({
                model: this.model,
                filters: this.filters,
            }),
        });

        let records = await loadRes.json();

        this.initialize(records);
        return records;
    }

    async _insert(insertData) {
        let insertRes = await fetch('/dataset/store',{
            method: 'POST',
            headers: this._ajaxHeaders,
            body: JSON.stringify({
                model: this.model,
                ...insertData,
            }),
        });
        let newRecord = new Record(await insertRes.json(), this);
        let newRecordPosition = newRecord.get('id');

        this._records.push(newRecord);
        this._propagateEvent('OnInsert', {
            record: newRecord,
        });
        this.setPosition(newRecordPosition);
        return newRecord;
    }

    async _delete(recordId) {
        let deletedRecord = this.getRecord(recordId);
        if (deletedRecord == undefined) return;

        let deletedRecordPosition = deletedRecord.get('id');
        let deleteRes = await fetch('/dataset/destroy',{
            method: 'POST',
            headers: this._ajaxHeaders,
            body: JSON.stringify({
                model: this.model,
                id: deletedRecordPosition
            }),
        });
        await deleteRes.json();

        this._records.splice(this._records.findIndex(r => r[this.primaryKey] == deletedRecord[this.primaryKey]), 1);
        this._propagateEvent('OnDelete', {
            record: deletedRecord,
        });

        this.setPosition(this._lastPosition);
        this._lastPosition = undefined;
    }

    async _save() {
        if (! this.isStatus('edit')) return;

        let recordsToSave = [];
        for (let recordId in this._editPool)
            recordsToSave.push(this.getRecord(recordId).getAll());

        let saveRes = await fetch('/dataset/update',{
            method: 'POST',
            headers: this._ajaxHeaders,
            body: JSON.stringify({
                model: this.model,
                records: recordsToSave,
            }),
        });
        await saveRes.json();

        this._editPool = { };
        this.setStatus('browse');
        this._propagateEvent('OnSave');
    }

    _propagateEvent(event, dto = { }) {
        dto['dataset'] = this;

        for (let childComponent of this._childComponents)
            if (childComponent[`dataset${event}`] instanceof Function)
                childComponent[`dataset${event}`](dto);

        if (event == 'OnReady') this._detectBindings();
        if (event == 'OnPositionChange' || event == 'OnValueChange') this.updateBindings();
    }
}
