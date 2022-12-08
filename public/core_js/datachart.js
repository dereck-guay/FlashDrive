class DataChart extends DatasetComponent {
    constructor(params) {
        super(params.dataset, params.containerElement);
        this.chartJS = undefined;
        this.id = Math.random().toString(36).substring(2, 10);

        // Private Properties
        this._type = params.type || 'line';
        this._scales = params.scales;
        this._height = params.height;
        this._datasources = params.datasources;
        this._labels = params.labels;
        this._legend = params.legend;
        this._title = params.title;
        this._tooltip = params.tooltip;

        // Loading
        this.render();
    }

    //Public Methods
    render() {
        this.containerElement.innerHTML = '';
        let chartCanvas = document.createElement('canvas');
        chartCanvas.className = 'w-full';
        if (this._height != undefined) chartCanvas.setAttribute('height', this._height);
        chartCanvas.id = this.id;

        let chartLabels = this._labels instanceof Function ? this._labels(this._datasources) : this._labels;
        let chartDatasets = [];
        for (let datasource of this._datasources) {
            chartDatasets.push({
                label: datasource.title,
                borderColor:  datasource.borderColor || 'rgba(249,115,22,1)',
                backgroundColor: datasource.backgroundColor || 'rgba(251,145,59,0.3)',
                borderWidth: datasource.borderWidth || 2,
                data: datasource.dataTransform(datasource),
            });
        }

        this.chartJS = new Chart(chartCanvas, {
            type: this._type,
            data: {
                labels: chartLabels,
                datasets: chartDatasets
            },
            options: {
                responsive: true,
                animation: false,
                plugins: {
                    legend: {
                        display: this._legend != undefined ? true : false,
                    },
                    tooltip: {
                        enabled: this._tooltip != undefined ? true : false,
                    },
                    title: {
                        display: this._title != undefined ? true : false,
                        text: this._title,
                    }
                },
                scales: this._scales,
            },
        });

        this.containerElement.append(chartCanvas);
    }
}
