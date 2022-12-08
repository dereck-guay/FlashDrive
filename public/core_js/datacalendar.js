class DataCalendar extends DatasetComponent {
    initialize() {
        this.render();

        for (let datasource of this._datasources)
            datasource.dataset.addChildComponent(this);
    }

    constructor(params) {
        super(params.dataset, params.containerElement);

        // Private Properties
        this._datasources = params.datasources;
        this._view = params.view || 'dayGridMonth';

        // Callbacks

        // Loading
        this.initialize();
    }

    // DataCalendar Events
    eventDidMount({ el, event }) {
        let { datasource, record } = event.extendedProps;

        if (datasource.onRightClick instanceof Function)
            el.addEventListener('contextmenu', (e) => {
                datasource.onRightClick(record, event, el);
                e.stopPropagation();
                e.preventDefault();
            });

        if (datasource.onClick instanceof Function)
            el.addEventListener('click', () => {
                datasource.onClick(record, event, el);
            });

        if (datasource.onHoverIn instanceof Function)
            el.addEventListener('mouseover', () => {
                datasource.onHoverIn(record, event, el);
            });

        if (datasource.onHoverOut instanceof Function)
            el.addEventListener('mouseout', () => {
                datasource.onHoverOut(record, event, el);
            });
    }

    // Dataset Events
    datasetOnReady(dto) {
        let datasource = undefined;
        for (let datasource of this._datasources)
            if (datasource.dataset == dto.dataset) {
                this._parseEvents(datasource);
                return;
            }
    }

    datasetOnPositionChange(dto) {
    }

    datasetOnValueChange(dto) {
    }

    datasetOnInsert(dto) {
    }

    datasetOnDelete(dto) {
    }

    //Public Methods
    render() {
        this.calendarObj = new FullCalendar.Calendar(this.containerElement, {
            initialView: this._view,
            nowIndicator: true,
            slotMinTime: '07:00',
            slotMaxTime: '18:00',
            slotDuration: '00:15:00',
            businessHours: {
                daysOfWeek: [ 1, 2, 3, 4, 5 ],
                startTime: '08:00',
                endTime: '17:00',
            },
            eventDidMount: this.eventDidMount.bind(this),
        });
        this.calendarObj.render();
    }

    _parseEvents(datasource) {
        let { dataset, startField, endField } = datasource;
        let records = dataset.getAllRecords();

        for (let record of records) {
            let calendarEvent = this.calendarObj.addEvent(datasource.dataTransform(record, datasource));
        }

    }
}
