class ForestField {
  visited = false;

  x = 0;

  y = 0;

  walls = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default class ForestGenerator {
  private fields: ForestField[] = [];

  private fieldMap: Map<string, ForestField> = new Map();

  public generate(sizeX: number, sizeY: number) {
    this.prepareFields(sizeX, sizeY);
    let startingField = this.getRandomField();
    let stack = [startingField];
    let visitedFields = 0;

    while (visitedFields < this.fields.length) {
      let currentField = stack.at(stack.length - 1)!;
      if (currentField.visited === false) {
        currentField.visited = true;
        visitedFields++;
      }

      let neighborFields = this.getNeighborFields(currentField).filter((field) => field.visited === false);

      let nextField = neighborFields[Math.floor(Math.random() * neighborFields.length)] || null;
      if (nextField === null) {
        stack.pop();
        continue;
      }
      this.markPath(currentField, nextField);
      stack.push(nextField);
    }
    let fields = this.toBoolArray(sizeX, sizeY);
    let width = sizeX * 2 + 1;
    return { fields, width };
  }

  /**
   * @private
   * @param {number} sizeX
   * @param {number} sizeY
   */
  public toBoolArray(sizeX: number, sizeY: number) {
    let boolArray = [];

    for (let y = -0.5; y <= sizeY; y += 0.5) {
      let fieldY = Math.floor(y);

      for (let x = -0.5; x < sizeX; x += 0.5) {
        let fieldX = Math.floor(x);
        let field = this.getField(fieldX, fieldY);

        if (field === null) {
          boolArray.push(false);
          continue;
        }

        if (fieldX === x && fieldY === y && field !== null) {
          boolArray.push(true);
          continue;
        }
        if (fieldX !== x && fieldY === y && field !== null) {
          boolArray.push(!field.walls.right);
          continue;
        }

        if (fieldX === x && fieldY !== y && field !== null) {
          boolArray.push(!field.walls.bottom);
          continue;
        }
        boolArray.push(false);
      }
    }
    return boolArray;
  }

  private getField(x: number, y: number) {
    return this.fieldMap.get(`${x}:${y}`) || null;
  }

  private getRandomField() {
    let seed = Math.random() * this.fields.length * 10;
    let index = Math.floor(Math.floor(seed) / 10);
    return this.fields[index];
  }

  private getNeighborFields(field: ForestField) {
    let neighborFields = [];

    let upperField = this.getField(field.x, field.y - 1);
    let lowerField = this.getField(field.x, field.y + 1);
    let leftField = this.getField(field.x - 1, field.y);
    let rightField = this.getField(field.x + 1, field.y);

    if (upperField !== null) {
      neighborFields.push(upperField);
    }

    if (lowerField !== null) {
      neighborFields.push(lowerField);
    }

    if (leftField !== null) {
      neighborFields.push(leftField);
    }

    if (rightField !== null) {
      neighborFields.push(rightField);
    }

    return neighborFields;
  }

  private markPath(field1: ForestField, field2: ForestField) {
    let x = field2.x - field1.x;
    let y = field2.y - field1.y;

    if (x === 1) {
      field1.walls.right = false;
      field2.walls.left = false;
    } else if (x === -1) {
      field1.walls.left = false;
      field2.walls.right = false;
    } else if (y === 1) {
      field1.walls.bottom = false;
      field2.walls.top = false;
    } else if (y === -1) {
      field1.walls.top = false;
      field2.walls.bottom = false;
    }
  }

  private prepareFields(sizeX: number, sizeY: number) {
    this.fields = [];
    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        let field = new ForestField(x, y);
        this.fields.push(field);
        this.fieldMap.set(`${x}:${y}`, field);
      }
    }
  }
}
