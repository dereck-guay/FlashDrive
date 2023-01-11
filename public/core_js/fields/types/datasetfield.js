class DatasetField {
    initialize() {
        this.render();
        if (this.dataset != undefined) this.dataset.addChildComponent(this);
    }

    constructor(parent, containerElement) {
        // Public Properties
        this.parent = parent;
        this.dataset = parent.dataset;
        this.containerElement = containerElement;
        this.inputElement = undefined;
        this.edit = parent.edit;
        this.id = parent.id
        this.recordId = parent.recordId;
        this.onChange = parent.onChange;
    }

    // DatasetField Events
    onValueChange(newValue) {
        if (this.dataset == undefined) return;
        let record = this.dataset.getRecord(this.recordId);
        if (record == undefined) return;

        record.set(this.edit, newValue);
        if (this.onChange instanceof Function)
            this.onChange({
                record: record,
                newValue: newValue,
                field: this.edit,
            });
    }

    // Dataset Events
    datasetOnReady(dto) {
        if (this.recordId == undefined) return;
        let record = this.dataset.getRecord(this.recordId);
        if (record == undefined) return;
        this.setValue(record.get(this.edit));
    }

    datasetOnPositionChange(dto) {
        if (this.recordId != undefined) return;

        let { record } = dto;
        if (record == undefined) return;
        this.setValue(record.get(this.edit));
    }

    datasetOnValueChange(dto) {
        if (document.activeElement == this.inputElement) return;

        let { field, newValue, record } = dto;
        if (this.edit != field) return;
        if (this.recordId && this.recordId != record.get('id')) return;

        this.setValue(newValue);
    }
}
