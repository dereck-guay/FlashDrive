class DataField extends DatasetComponent{
    constructor(params) {
        super(params.dataset, params.containerElement);

        // Public Properties
        this.edit = params.edit;
        this.id = '_' + Math.random().toString(36).substring(2, 10);
        this.onChange = params.onChange;

        // Private Properties
        this._settings = params.settings;
        this._label = params.label;
        this._inputComponent = undefined;
        this._format = params.format || 'field';
        this._types = {
            text: TextField,
            select: SelectField,
        }
        this._type = this._types[params.type || 'text'];

        // Loading
        this.render();
    }

    // Public Methods
    render() {
        this[`_${this._format}Render`]();
    }

    // Private Methods
    _fieldRender() {
        this.containerElement.classList.add('dataset_field_container');

        this._inputComponent = new this._type({
            parent: this,
            containerElement: this.containerElement,
            ...this._settings,
        });

        if (this._label == undefined) return;

        let labelElement = document.createElement('label');
        labelElement.classList.add('dataset_field_label');
        labelElement.innerHTML = this._label;
        labelElement.setAttribute('for', this.id);
        this.containerElement.prepend(labelElement);
    }

    _labelRender() {

    }

    _cellRender() {

    }
}
