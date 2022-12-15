require("./utils");
const assert = require("assert");


{ // Split by array
    {
        const arr = [1,2,3,4,5];
        assert(arr.splitBy(1).equals([[1,2,3,4,5]]));
        assert(arr.splitBy(2).equals([[1,2,3],[4,5]]));
        assert(arr.splitBy(3).equals([[1,2],[3,4],[5]]));
        assert(arr.splitBy(4).equals([[1,2],[3,4],[5]]));
        assert(arr.splitBy(5).equals([[1],[2],[3],[4],[5]]));
        assert(arr.splitBy(6).equals([[1],[2],[3],[4],[5]]));
    }
    {
        const arr = [1,2,3,4,5,6];
        assert(arr.splitBy(1).equals([[1,2,3,4,5,6]]));
        assert(arr.splitBy(2).equals([[1,2,3],[4,5,6]]));
        assert(arr.splitBy(3).equals([[1,2],[3,4],[5,6]]));
        assert(arr.splitBy(4).equals([[1,2],[3,4],[5,6]]));
        assert(arr.splitBy(5).equals([[1,2],[3,4],[5,6]]));
        assert(arr.splitBy(6).equals([[1],[2],[3],[4],[5],[6]]));
        assert(arr.splitBy(7).equals([[1],[2],[3],[4],[5],[6]]));
    }
}


{ // MapN
    { // 1d
        const arr = [1,2,3,4];
        assert(arr.mapN((a) => (a*a)).equals([1,4,9,16]));
        assert(arr.mapN((_,i) => (i)).equals([0,1,2,3]));
        assert(arr.mapN((_,__,arr) => (arr)).equals([[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]]));
    }
    { // 2d
        const arr = [[1,2],[3,4]];
        assert(arr.mapN((a) => (a*a)).equals([[1,4],[9,16]]));
        assert(arr.mapN((_,i,j) => ([i,j])).equals([[[0,0],[0,1]],[[1,0],[1,1]]]));
        assert(arr.mapN((_,__,___,arr) => (arr)).equals([[[[1,2],[3,4]],[[1,2],[3,4]]],[[[1,2],[3,4]],[[1,2],[3,4]]]]));
    }
    { // 3d
        const arr = [[[1,2],[3,4]],[[5,6],[7,8]]];
        assert(arr.mapN((a) => (a*a)).equals([[[1,4],[9,16]],[[25,36],[49,64]]]));
        assert(arr.mapN((_,i,j,k) => ([i,j,k])).equals([[[[0,0,0],[0,0,1]],[[0,1,0],[0,1,1]]],[[[1,0,0],[1,0,1]],[[1,1,0],[1,1,1]]]]));
    }
}

{ // Sum
    { // 1d
        const arr = [1,2,3,4];
        assert(arr.sum() === 10);
    }
    { // 2d
        const arr = [[1,2],[3,4]];
        assert(arr.sum() === 10);
    }
    { // 3d
        const arr = [[[1,2],[3,4]],[[5,6],[7,8]]];
        assert(arr.sum() === 36);
    }
}


{ // at
    { // 1d
        const arr = [1,2,3,4];
        assert(arr.at(0) === 1);
        assert(arr.at(1) === 2);
        assert(arr.at(2) === 3);
        assert(arr.at(3) === 4);
        assert(arr.at(-1) === 4);
        assert(arr.at(-3) === 2);
    }
    { // 2d
        const arr = [[1,2],[3,4]];
        assert(arr.at(0,0) === 1);
        assert(arr.at(0,1) === 2);
        assert(arr.at(1,0) === 3);
        assert(arr.at(1,1) === 4);
        assert(arr.at(-1,-1) === 4);
    }
    { // 3d
        const arr = [[[1,2],[3,4]],[[5,6],[7,8]]];
        assert(arr.at(0,0,0) === 1);
        assert(arr.at(0,0,1) === 2);
        assert(arr.at(0,1,0) === 3);
        assert(arr.at(0,1,1) === 4);
        assert(arr.at(1,0,0) === 5);
        assert(arr.at(1,0,1) === 6);
        assert(arr.at(1,1,0) === 7);
        assert(arr.at(1,1,1) === 8);
        assert(arr.at(-1,-1,-1) === 8);
    }
}

{ // walk + dirs
    { // 1d
        const arr = [1,2,3,4,5];
        const dirs = arr.dirs;
        assert(dirs.equals([[+1], [-1]]));
        assert(Array.from(arr.walk(dirs[0], 2)).equals([3,4,5]));
        assert(Array.from(arr.walk(dirs[1], 2)).equals([3,2,1]));
        assert(Array.from(arr.walk(dirs[0], 0)).equals([1,2,3,4,5]));
        assert(Array.from(arr.walk(dirs[1], 4)).equals([5,4,3,2,1]));
        assert(Array.from(arr.walk(dirs[0], 4)).equals([5]));
        assert(Array.from(arr.walk(dirs[1], 0)).equals([1]));
    }
    { // 2d
        const arr = [
            [3,0,9,7,3],
            [2,5,5,1,2],
            [6,5,3,3,2],
            [3,3,5,4,9],
            [3,5,3,9,0],
        ];
        const dirs = arr.dirs;
        assert(dirs.equals([[+1,0],[-1,0],[0,+1],[0,-1]]));
        const [south, north, east, west] = dirs;
        assert(Array.from(arr.walk(south, 2, 2)).equals([3,5,3]));
        assert(Array.from(arr.walk(north, 2, 2)).equals([3,5,9]));
        assert(Array.from(arr.walk(east,  2, 2)).equals([3,3,2]));
        assert(Array.from(arr.walk(west,  2, 2)).equals([3,5,6]));
    }
    { // 3d
        const arr = [[[1]]];
        const dirs = arr.dirs;
        assert(dirs.equals([[+1,0,0],[-1,0,0],[0,+1,0],[0,-1,0],[0,0,+1],[0,0,-1]]));
    }
}


{ // Fill
    assert(new Array(4).fill(4).equals([4,4,4,4]));
    assert(new Array(4).fill((i) => i).equals([0,1,2,3]));
}


{ // Add, sum, mul, div
    { // 1d vec to 1d vec
        const a = [1,2,3,4];
        const b = [4,3,2,1];
        assert(a.add(b).equals([5,5,5,5]));
        assert(a.sub(b).equals([-3,-1,1,3]));
        assert(b.sub(a).equals([3,1,-1,-3]));
        assert(a.sub(a).equals([0,0,0,0]));
        assert(a.mul(b).equals([4,6,6,4]));
        assert(a.div(b).equals([1/4,2/3,3/2,4]));
    }
    { // 1d vec to scalar
        const a = [1,2,3,4];
        const b = 5;
        assert(a.add(b).equals([6,7,8,9]));
        assert(a.sub(b).equals([-4,-3,-2,-1]));
        assert(a.mul(b).equals([5,10,15,20]));
        assert(a.div(b).equals([1/5,2/5,3/5,4/5]));
    }
    { // 2d vec to 2d vec
        const a = [[1,2],[3,4]];
        const b = [[4,3],[2,1]];
        assert(a.add(b).equals([[5,5],[5,5]]));
        assert(a.sub(b).equals([[-3,-1],[1,3]]));
        assert(b.sub(a).equals([[3,1],[-1,-3]]));
        assert(a.sub(a).equals([[0,0],[0,0]]));
        assert(a.mul(b).equals([[4,6],[6,4]]));
        assert(a.div(b).equals([[1/4,2/3],[3/2,4]]));
    }
    { // 2d vec to 1d vec
        const a = [[1,2],[3,4]];
        const b = [5,6];
        assert(a.add(b).equals([[6,7],[9,10]]));
        assert(a.sub(b).equals([[-4,-3],[-3,-2]]));
        assert(a.mul(b).equals([[5,10],[18,24]]));
        assert(a.div(b).equals([[1/5,2/5],[3/6,4/6]]));
    }
    { // 2d vec to scalar
        const a = [[1,2],[3,4]];
        const b = 5;
        assert(a.add(b).equals([[6,7],[8,9]]));
        assert(a.sub(b).equals([[-4,-3],[-2,-1]]));
        assert(a.mul(b).equals([[5,10],[15,20]]));
        assert(a.div(b).equals([[1/5,2/5],[3/5,4/5]]));
    }
}

console.log("PASSED :)");
