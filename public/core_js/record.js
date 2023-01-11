class Record {
    constructor(record, dataset) {
        this.record = record;
        this.dataset = dataset;

        for (let property in record)
            this[property] = record[property];
    }

    revert() {
        for (let property in this.record) {
            this[property] = this.record[property];
            this.dataset.onRecordChange(this, property, this.record[property]);
        }
    }

    getAll() {
        let recordData = {};
        for (let property in this)
            if (! (this[property] instanceof Function) && property != 'dataset' && property != 'record')
                recordData[property] = this[property];

        return recordData;
    }

    get(property, formatting) {
        if (! property in this || property == undefined) return formatter(formatting, '');
        if (property.indexOf('.') != -1) {
            let [relationName, field, ...others] = property.split('.');
            let relation = this.dataset.relation[relationName];

            if (relation == undefined) return formatter(formatting, '');
            let { localKey, foreignKey, dataset } = relation;
            let subRecord = dataset.getRecord(this.get(localKey));

            if (subRecord == undefined) return formatter(formatting, '');
            return subRecord.get([field, ...others].join('.'), formatting);
        }

        let relation = this.dataset.relation[property];
        // OneToMany
        if (relation != undefined && relation.hasMany) {
            let { localKey, foreignKey, dataset } = relation;
            let subRecordsObj = [];
            let subRecordsArray = dataset.getAllRecords().filter(
                record => record.get(foreignKey) == this.get(localKey)
            );

            return subRecordsArray
        }
        else if (relation != undefined) {
            let { localKey, foreignKey, dataset, intermidiateTable } = relation;
            // OneToOne
            if (intermidiateTable == undefined)
                return dataset.getRecord(this.get(localKey));

            // ManyToMany
            let intermidiateRecords = intermidiateTable.filter(r => r[localKey] == this.get(this.dataset.primaryKey));
            return intermidiateRecords.map(ir => dataset.getRecord(ir[foreignKey]))
        }

        let value = this[property];

        if (formatting != undefined) return formatter(formatting, value);
        return formatter(formatting, value);
    }

    set(property, newValue) {
        if (newValue == undefined) newValue = null;
        this[property] = newValue;
        this.dataset.onRecordChange(this, property, newValue);
    }
}
