

module.exports = function compare(left, right) {
    // Both numbers
    if (typeof left === "number" && typeof right === "number")
        return (left - right);

    // Both are lists
    if (typeof left === "object" && typeof right === "object") {
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
            const r = compare(left[i], right[i]);
            if (r !== 0)
                return r;
        }
        return (left.length - right.length);
    }

    // Left is list, turn right to number, or vice-versa
    return (
        (typeof left === "object")
        ? compare(left, [right])
        : compare([left], right)
    );
}
