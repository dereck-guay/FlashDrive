class SelectField extends DatasetField {
    constructor(params) {
        super(params.parent, params.containerElement);

        // Private Properties
        this._options = params.options;
        this._displayField = params.displayField;
        this._valueField = params.valueField;

        this.initialize();
    }

    render() {
        // Create
        let inputElement = document.createElement('select');
        inputElement.className = 'dataset_field_select';

        for (let option of this._options) {
            let newOptionsElt = document.createElement('option');

            newOptionsElt.value = option[this._valueField];
            newOptionsElt.innerHTML = option[this._displayField];

            inputElement.append(newOptionsElt)
        }

        this.containerElement.append(inputElement);
        this.inputElement = inputElement;
    }

    setValue(newValue) {
        this.inputElement.value = newValue;
    }
}
