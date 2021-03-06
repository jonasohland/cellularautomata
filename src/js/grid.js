import Cell from './cell'

export default class Grid {

    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) 
    {
        let computed_style = getComputedStyle(container)
        let columns = computed_style['grid-template-columns'].split(" ").length;
        let rows = computed_style['grid-template-rows'].split(" ").length;

        for (let i = 0; i < rows * columns; ++i) {

            let row = Math.floor(i / columns);
            let column = Math.floor(i - row * columns);

            let new_element = document.createElement('div');
            new_element.classList.add('grid-item');

            container.appendChild(new_element);
            this._cells.push(new Cell(new_element, this, row, column));
        }

        this._width = columns;
    }

    /** @param {Array<[number, number]>} cell_idx_list  */
    reviveCells(cell_idx_list) {
        cell_idx_list.forEach(cl_idx => {
            let cell = this.cell(cl_idx[0], cl_idx[1]);
            if (cell)
                cell.revive();
        });
    }

    killCells() {
        cell_idx_list.forEach(cl_idx => {
            let cell = this.cell(cl_idx[0], cl_idx[1]);
            if (cell)
                cell.kill();
        });
    }

    clear() {
        this._cells.forEach(cell => cell.kill());
    }

    backup() {
        this._cells.forEach(cell => cell.pushBackup());
    }

    reset() {
        this._cells.forEach(cell => cell.popBackup());
    }

    /**
     * @param {number} col 
     * @return {Array<Cell>}
     */
    aliveCellsInCol(col) {
        return this.col(col).filter(cell => cell.isAlive());
    }

    /**
     * @param {number} col 
     * @returns {Array<Cell>}
     */
    col(col) {
        let col_cells = [];
        for (let i = 0; i < this.rows(); ++i)
            col_cells.push(this.cell(i, col))
        return col_cells;
    }

    /**
     * @param {number} row
     * @param {number} column 
     */
    cell(row, column) {
        return this._cells[row * this._width + column];
    }

    /** @returns {number} */
    columns() {
        return this._width;
    }

    /** @returns {number} */
    rows() {
        return Math.floor(this._cells.length / this._width);;
    }

    exportGrid() {
        let data = [];
        for (let y = 0; y < this.columns(); ++y) {
            let row = [];
            for (let x = 0; x < this.rows(); ++x) 
                row.push(this.cell(y, x).isAlive());
            data.push(row);
        }
        return JSON.stringify(data);
    }

    /** @param {string} data */
    importGrid(data) {

        /** @type {Array<Array<boolean>>} */
        let cdata = JSON.parse(data);

        for (let y = 0; y < cdata.length; ++i) {
            for (let x = 0; x < cdata[y].length; ++x) {
                let cell = this.cell(y, x);
                if (cell) 
                    cell.setNextState(cdata[y, x]);
            }
        }

        this._cells.forEach(cell => cell.commitState());
    }

    /** @type {Array<Cell>} */
    _cells = [];
}