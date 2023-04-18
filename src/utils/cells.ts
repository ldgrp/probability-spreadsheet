export type Direction = "up" | "down" | "left" | "right";

export function arrowKeyToDirection(key: string): Direction | undefined {
    switch (key) {
        case "ArrowUp":
            return "up";
        case "ArrowDown":
            return "down";
        case "ArrowLeft":
            return "left";
        case "ArrowRight":
            return "right";
        default:
            return undefined;
    }
}

export type CellValue = number[] | string;

export function getCellId(row: number, column: number): string {
  return `${String.fromCharCode("A".charCodeAt(0) + column)}${row + 1}`;
}

/**
 * Return the column of the given cell id.
 * TODO: Support more than 26 columns.
 */
export function getColumn(id: string): string | undefined {
    return id.match(/^[A-Z]/)?.[0];
}

/**
 * Return the row number of the given cell id.
 */
export function getRow(id: string): number | undefined {
    const row = id.match(/[0-9]+$/)?.[0];
    if (row) {
        return parseInt(row);
    }
    return undefined;
}

/**
 * Returns the id of the cell in the given direction from the given cell. 
 * @param id The id of the cell to get the neighbor of. For example, A1, B3, C4, etc
 * @param dir The direction to get the neighbor of.
 * @param row_count The number of rows in the table.
 * @param column_count The number of columns in the table.
 */
export function getNeighborCellId(id: string, dir: Direction, row_count?: number, column_count?: number): string | undefined {
    const column = getColumn(id);
    const row = getRow(id);

    if (column === undefined || row === undefined) {
        return undefined;
    }

    switch (dir) {
        case "up":
            if (row === 1) {
                return undefined;
            }
            return `${column}${row - 1}`;
        case "down":
            if (row_count && row === row_count) {
                return undefined;
            }
            return `${column}${row + 1}`;
        case "left":
            if (column === "A") {
                return undefined;
            }
            return `${String.fromCharCode(column.charCodeAt(0) - 1)}${row}`;
        case "right":
            if (column_count && column === String.fromCharCode("A".charCodeAt(0) + column_count - 1)) {
                return undefined;
            }
            return `${String.fromCharCode(column.charCodeAt(0) + 1)}${row}`;
    }
}
