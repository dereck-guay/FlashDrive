class TextField extends DatasetField {
    constructor(params) {
        super(params.parent, params.containerElement);

        // Private Properties
        this._type = params.type || 'text';
        this._placeholder = params.placeholder || '';

        this.initialize();
    }

    render() {
        // Create
        let inputElement = document.createElement('input');
        inputElement.id = this.id;
        inputElement.classList.add('dataset_field_text');

        // Setup
        inputElement.type = this._type;
        inputElement.placeholder = this._placeholder;
        inputElement.addEventListener('input', e => {
            let newValue = e.target.value;
            this.onValueChange(newValue);
        });

        this.containerElement.append(inputElement);
        this.inputElement = inputElement;
    }

    setValue(newValue) {
        this.inputElement.value = newValue;
    }
}
