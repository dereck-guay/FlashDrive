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

        let emptyOption = document.createElement('option');
        emptyOption.value = -1;
        emptyOption.innerHTML = '...';
        inputElement.append(emptyOption)

        for (let option of this._options) {
            let newOptionsElt = document.createElement('option');

            newOptionsElt.value = option[this._valueField];
            newOptionsElt.innerHTML = option[this._displayField];

            inputElement.append(newOptionsElt)
        }

        inputElement.addEventListener('input', e => {
            let newValue = e.target.value;
            if (newValue == -1) newValue = undefined;
            this.onValueChange(newValue);
        });

        this.containerElement.append(inputElement);
        this.inputElement = inputElement;
    }

    setValue(newValue) {
        if (! newValue) newValue = -1;
        this.inputElement.value = newValue;
    }
}
