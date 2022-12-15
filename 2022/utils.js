
Math.snap = function(num) {
    return (num < 0 ? Math.floor(num) : Math.ceil(num));
}

// -----------------------------------------------------------
// ------------------ N-Dimensional methods ------------------
// -----------------------------------------------------------
// Getter for `dim` => dimension of the array
Object.defineProperty(Array.prototype, "dim", {
    get: function() {
        if (this.length === 0)
            return 0;
        const child = this[0];
        if (!isArray(child))
            return 1;
        return 1 + child.dim;
    }
});
// Getter for `dirs` => list of unit directions in this dimension
// 1D: [[+x], [-x]] = [right, left]
// 2D: [[+y], [-y], [+x], [-x]] = [south, north, east, west]
let precomputedDirs = {};
function getUnitDirsForDim(dim) {
    if (!(dim in precomputedDirs)) {
        precomputedDirs[dim] = new Array(2 * dim)
            .fill((i) => new Array(dim)
                .fill((j) => ((i % 2 === 0 ? +1 : -1) * (Math.floor(i/2) === j ? +1 : 0))));
    }

    return precomputedDirs[dim];
}
Object.defineProperty(Array.prototype, "dirs", {
    get: function() {
        const dim = this.dim;
        if (dim === 0)
            return 0;
        return getUnitDirsForDim(dim);
    }
});

// Inidices are in (x,y,z,...) order
const _at = Array.prototype.at;
Array.prototype.at = function(...indices) {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("at: Dimension is 0!");
    const child = _at.call(this, indices[0]);
    return (indices.length === 1) ? child : child.at(...indices.slice(1));
}

Array.prototype.set = function(...vals) {
    const [indices, val] = vals.splitLast();
    if (indices.length === 1) {
        this[indices[0]] = val;
        return;
    }
    this[indices[0]].set(...indices.slice(1), val);
}

Array.prototype.isWithinBounds = function(...indices) {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("isWithinBounds: Dimension is 0!");
    if (indices.length !== dim)
        throw new Error(`isWithinBounds: Dimension is ${dim} while indices given were ${indices}!`);
    // Make sure current index is within `this` direct bounds
    const i = indices[0];
    if (!(i >= 0 && i < this.length))
        return false;
    // Then if we have more then 1 dimension, make sure indices are within child dimension
    return (dim === 1) || (this[i].isWithinBounds(...indices.slice(1)));
}
Array.prototype.walk = function* (dir, ...pt) {
    // Loop until the point has moved out of bounds
    do {
        // Yield the point
        yield this.at(...pt);

        // Move point
        dir.forEach((dd, i) => (pt[i] += dd));
    } while (this.isWithinBounds(...pt));
}
Array.prototype.walk.prototype.until = function*(condition) {
    // Skip first element
    yield this.next().value;
    for (const part of this) {
        yield part;
        if (condition(part))
            break;
    }
}


function binop(a, b, op) {
    const dim = a.dim;
    if (dim === 0)
        throw new Error("binop: Dimension is 0!");

    // Add each element in b to a
    if (typeof b === "object") {
        if (a.length !== b.length)
            throw new Error(`binop: Attempted to add arrays w/ different lengths! ${a.length} vs ${b.length}`);
        if (dim === 1)
            return a.map((el, i) => op(el, b[i]));
        return a.map((row, i) => binop(row, b[i], op));
    }
    // Add b to each element in a
    else {
        if (dim === 1)
            return a.map((el) => op(el, b));
        return a.map((row) => binop(row, b, op));
    }
}
Array.prototype.add = function(other) { return binop(this, other, (a, b) => (a + b)); }
Array.prototype.sub = function(other) { return binop(this, other, (a, b) => (a - b)); }
Array.prototype.mul = function(other) { return binop(this, other, (a, b) => (a * b)); }
Array.prototype.div = function(other) { return binop(this, other, (a, b) => (a / b)); }

Array.prototype.sum = function() {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("sum: Dimension is 0!");
    if (dim === 1)
        return this.reduce((sum, cur) => (sum + cur), 0);
    return this.reduce((sum, cur) => (sum + cur.sum()), 0);
}

Array.prototype.product = function() {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("sum: Dimension is 0!");
    if (dim === 1)
        return this.reduce((sum, cur) => (sum * cur), 1);
    return this.reduce((sum, cur) => (sum * cur.sum()), 1);
}

Array.prototype.max = function() {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("max: Dimension is 0!");
    if (dim === 1)
        return Math.max(...this);
    return Math.max(...this.map((el) => el.max()));
}

Array.prototype.maxN = function(N) {
    return this.sort((a,b) => (a-b)).slice(-N);
}

Array.prototype.mapN = function(func) {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("mapN: Dimension is 0!");
    if (dim === 1)
        return this.map(func);
    const dimFunc = (i) => (el, ...rest) => func(el, i, ...rest.slice(0,-1), this);
    return this.map((row, i) => row.mapN(dimFunc(i)));
}

Array.prototype.forEachN = function(func) {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("forEachN: Dimension is 0!");
    if (dim === 1)
        return this.forEach(func);
    const dimFunc = (i) => (el, ...rest) => func(el, i, ...rest.slice(0,-1), this);
    return this.forEach((row, i) => row.forEachN(dimFunc(i)));
}

Array.prototype.findIndexN = function(func) {
    const dim = this.dim;
    if (dim === 0)
        throw new Error("findIndexN: Dimension is 0!");
    if (dim === 1)
        return [this.findIndex(func)];
    const dimFunc = (i) => (el, ...rest) => func(el, i, ...rest.slice(0,-1), this);
    let col = [-1];
    const row = this.findIndex((row, i) => {
        const nCol = row.findIndexN(dimFunc(i));
        if (nCol.last() === -1)
            return false;
        col = nCol;
        return true;
    });
    return [row, ...col];
}

Array.prototype.findIndices = function(...funcs) {
    return funcs.map((func) => this.findIndexN(func));
}

Array.prototype.asInts = function() {
    return this.mapN((a) => parseInt(a));
}
Array.prototype.asFloats = function() {
    return this.mapN((a) => parseFloat(a));
}

Array.prototype.equals = function(other) {
    if (this === other)
        return true;
    if (other == null || typeof other !== "object")
        return false;
    if (other.length !== this.length)
        return false;
    return this.every((el, i) => {
        if (typeof el === "object")
            return el.equals(other[i]);
        else
            return (el === other[i]);
    });
}


class Graph {
    constructor() {
        this.vertices = new Map();
        this.connections = new Map();
        this.reverseConnections = new Map();
    }

    bfsSearch(start, stop) {
        const visited = new Set();
        const queue = [{ node: start, layer: 0, parent: undefined }];
        const paths = new Map();
        let stopNode = undefined;

        while (queue.length > 0) {
            const { node, layer, parent } = queue.shift(); // De-queue
            if (visited.has(node)) // Already visited
                continue;
            visited.add(node);

            // Keep track of path to trace-back
            paths.set(node, parent);

            // Check if found
            if ((typeof stop === "function" && stop(this.get(node), node)) ||
                (node === stop)) {
                stopNode = node;
                break;
            }

            // Loop through neighbors and add to queue
            for (const n of this.getConnections(node))
                queue.push({ node: n, layer: layer+1, parent: node });
        }

        if (!paths.has(stopNode)) // Didn't find target
            return undefined;

        // Backtrace path
        let path = [stopNode];
        while (path[0] !== start)
            path.unshift(paths.get(path[0]));
        return path;
    }

    add(key, val) {
        this.vertices.set(key, val);
        this.connections.set(key, []);
        this.reverseConnections.set(key, []);
    }

    addConnection(n1, n2) {
        this.connections.get(n1).push(n2);
        this.reverseConnections.get(n2).push(n1);
    }

    get(n) {
        return this.vertices.get(n);
    }

    getConnections(n) {
        return this.connections.get(n);
    }

    reverse() {
        function copyMapArr(map) {
            // Copy array in each map value
            return new Map(Array.from(map.entries())
                                .map(([key, val]) => [key, [...val]]));
        }

        const r = new Graph();
        r.vertices = new Map(this.vertices.entries());
        r.connections = copyMapArr(this.reverseConnections);
        r.reverseConnections = copyMapArr(this.connections);
        return r;
    }
}

class TupleSet {
    constructor() {
        this.set = new Set();
        this.keyMap = new Map();
        this.type = undefined;
    }

    add(x) {
        this.keyMap.set(key.join(","), key);
        return this.set.add(x.join(","));
    }
    has(x) {
        return this.set.has(x.join(","));
    }
    delete(x) {
        this.keyMap.delete(key.join(","));
        return this.set.delete(x.join(","));
    }
    clear() {
        this.set.clear();
    }

    *[Symbol.iterator]() {
        for (const val of this.set)
            yield this.keyMap.get(val);
    }
}
Set.TupleSet = TupleSet;

class TupleMap {
    constructor() {
        this.map = new Map();
        this.keyMap = new Map();
    }

    set(key, val) {
        this.keyMap.set(key.join(","), key);
        return this.map.set(key.join(","), val);
    }
    get(key) {
        return this.map.get(key.join(","));
    }
    has(key) {
        return this.map.has(key.join(","));
    }
    delete(key) {
        this.keyMap.delete(key.join(","));
        return this.map.delete(key.join(","));
    }
    clear() {
        this.map.clear();
    }

    keys() {
        return this.keyMap.values();
    }
    values() {
        return this.map.values();
    }

    *[Symbol.iterator]() {
        for (const [key, val] of this.map)
            yield [this.keyMap.get(key), val];
    }
}
Map.TupleMap = TupleMap;

// condition is condition on neighbour to be a connection
// method = "adjacent" | "all" neighbors
Array.prototype.toGraph = function(condition, method = "adjacent") {
    const graph = new Graph();

    // Fill vertices
    this.forEachN((val, ...rest) => graph.add(rest.slice(0, -1).join(","), val));

    // Fill in connections based on `condition` and neighbors
    graph.vertices.forEach((vert, key) => {
        const pos = key.split(",").asInts();
        for (const n of pos.positions.neighbors[method]) {
            if (!this.isWithinBounds(...n))
                continue;
            const nKey = n.join(",");
            if (!condition(vert, graph.get(nKey), graph))
                continue;
            graph.addConnection(key, nKey);
        }
    });

    return graph;
}

Array.prototype.flatten = function() {
    return this.flat(this.dim);
}
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------




// -----------------------------------------------------------
// ------------------ 1-Dimensional methods ------------------
// -----------------------------------------------------------
const _fill = Array.prototype.fill;
Array.prototype.fill = function(val) {
    if (typeof val === "function")
        return this.fill(0).map((_, i) => val(i));
    return _fill.call(this, val);
}


// Vectors
Array.prototype.len2 = function() {
    return this.map((el) => (el**2)).sum();
}
Array.prototype.len = function() {
    return Math.sqrt(this.len2());
}
Array.prototype.normalize = function() {
    return this.div(this.len());
}
Array.prototype.dirTo = function(other) {
    return other.sub(this).normalize();
}

// Utils to get common positions from the given vector
let precomputedNeighbors = {};
Object.defineProperty(Array.prototype, "positions", {
    get: function() {
        if (this.dim !== 1)
            throw new Error(`positions: Attempted to get positions for a ${this.dim}D-array! ${this}`);
        const dim = this.length;

        // Add to pre-computation for this dimension
        if (!(dim in precomputedNeighbors)) {
            precomputedNeighbors[dim] = {
                adjacent: getUnitDirsForDim(dim),
                all: Array(3**dim).fill(i => Array(dim).fill(_ => {
                    const idx = i % 3;
                    i = Math.floor(i/3);
                    return idx;
                })).map(pos => pos.sub(Array(dim).fill(1))),
            };
        }

        return {
            neighbors: {
                adjacent: precomputedNeighbors[dim].adjacent.map((pos) => this.add(pos)),
                all: precomputedNeighbors[dim].all.map((pos) => this.add(pos)),
            }
        };
    }
});

Array.prototype.isNeighborsWith = function(other) {
    return this.positions.neighbors.all.some((pos) => pos.equals(other));
}

Array.prototype.pop = function(amt = 1) {
    return this.splice(-amt, amt).reverse();
}

Array.prototype.snap = function() {
    return this.map(Math.snap);
}

// chunk or partition maybe?
Array.prototype.groupBy = function(size) {
    return this.reduce((result, el, idx) => {
        const i = Math.floor(idx / size);
        if (!result[i])
            result[i] = [];
        result[i].push(el);
        return result;
    }, []);
}

Array.prototype.walkTo = function*(pt) {
    const dir = this.dirTo(pt);
    let p = this;
    yield p;
    while (!p.equals(pt))
        yield (p = p.add(dir));
}
Array.prototype.pathTo = function(pt) {
    return Array.from(this.walkTo(pt));
}

Array.prototype.zip = function(other) {
    return this.map((val, i) => [val, other[i]]);
}

Array.prototype.withPrev = function() {
    return this.slice(1).zip(this.slice(0,-1));
}

Array.prototype.top = function() {
    return this.at(-1);
}

Array.prototype.first = function() {
    return this[0];
}
Array.prototype.last = function() {
    return this.at(-1);
}

Array.prototype.popFirst = function() {
    return this.splice(0, 1)[0];
}


Array.prototype.mapExceptLast = function(func) {
    return this.map((val, index, arr) => {
        if (index === arr.length-1)
            return val;
        return func(val, index, arr);
    });
}

Array.prototype.splitBy = function(splitSize) {
    return this.groupBy(Math.ceil(this.length / splitSize));
}

Array.prototype.unique = function() {
    return Array.from(new Set(this));
}

Array.prototype.intersect = function(...others) {
    return others.reduce(
        (total, cur) => total.filter((l) => cur.includes(l)),
    this).unique();
}

Array.prototype.splitLast = function(amt = 1) {
    return [this.slice(0, -amt), ...this.slice(-amt)];
}

Array.prototype.as2DString = function(rowLen, hJoin = "", vJoin = "\n") {
    return this.groupBy(rowLen).map((row) => row.join(hJoin)).join(vJoin);
}
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------


// -----------------------------------------------------------
// ------------------ 2-Dimensional methods ------------------
// -----------------------------------------------------------
function isArray(obj) {
    return (typeof obj === "object" && "length" in obj)
}

Array.prototype.is2D = function() {
    return (this.dim === 2);
}

Array.prototype.transpose = function() {
    let matrix = new Array(this[0].length).fill(0).map((_) => new Array(this.length).fill(0));
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this[0].length; j++)
            matrix[j][i] = this[i][j];
    }
    return matrix;
}

Array.prototype.perimeter = function() {
    return this.length * 2 + this[0].length * 2 - 4;
}

Array.prototype.asStacks = function() {
    return this.transpose().map((arr) => arr.reverse());
}

Array.prototype.trimTops = function(match = " ") {
    return this.map((arr) => {
        while (arr.top().match(match))
            arr.pop();
        return arr;
    });
}
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------



// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------
// ---------------------- String methods ----------------------
// ------------------------------------------------------------
String.prototype.splitLast = function(delimeter = "\n", amt = 1) {
    const [rest, ...last] = this.split(delimeter).splitLast(amt);
    return [rest.join(delimeter), ...last];
}

String.prototype.splitWith = function(search) {
    return Array.from(this.matchAll(search))
        .map(([match]) => match);
}
String.prototype.parseNumbers = function() {
    return this.splitWith(/[\-0-9]+/g).map((num) => Number(num));
}

String.prototype.intersect = function(...others) {
    return this.split("").intersect(...others);
}

String.prototype.groupBy = function(size) {
    return this.split("").groupBy(size).map((arr) => arr.join(""));
}
String.prototype.splitBy = function(splitSize) {
    return this.split("").splitBy(splitSize).map((arr) => arr.join(""));
}

String.prototype.halve   = function() { return this.splitBy(2); }
String.prototype.third   = function() { return this.splitBy(3); }
String.prototype.quarter = function() { return this.splitBy(4); }

String.prototype.toCode = function() {
    return this.codePointAt(0);
}

String.prototype.isUpperCase = function() {
    return (this.valueOf() === this.toUpperCase());
}

String.prototype.isLowerCase = function() {
    return (this.valueOf() === this.toLowerCase());
}

String.prototype.parseFixedGrid = function(search = "x", inConfig = {}) {
    const defaultConfig = { spacer: "", searchTarget: "x", breaker: "\n" };
    const { spacer, searchTarget, breaker } = { ...defaultConfig, ...inConfig };

    const regexEscapify = (str) => ("\\" + str.split("").join("\\"));

    // const splitRegex = new RegExp(regexEscapify(search).replace(regexEscapify(searchTarget), ".*?"), "g");


    // const regex = new RegExp(regexEscapify(search).replace(regexEscapify(searchTarget), ".*?"), "g");

    let searchTargetIndex = search.indexOf(searchTarget);

    return this.split(breaker)
        .map((line) => line
                .groupBy(search.length + spacer.length)
                .mapExceptLast((el) => (spacer.length === 0 ? el : el.slice(0, -spacer.length)))
                .map((el) => el.slice(searchTargetIndex, searchTargetIndex + searchTarget.length))
        );
}
String.prototype.parseNumGrid = function(search = "x", inConfig = {}) {
    return this.parseFixedGrid(search, inConfig)
        .map((arr) => arr.map((el) => Number(el)));
}
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
