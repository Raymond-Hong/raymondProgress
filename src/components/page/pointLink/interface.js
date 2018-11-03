(function linkInterface(datas) {
  return matchBlockTwo;

  function isEmpty(data) {
    return typeof data == 'undefined';
  }

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function matchBlock(datas, srcPt, destPt) {
    if (srcPt.x != destPt.x && srcPt.y != destPt.y) {
      return false;
    }
    var min, max;
    if (srcPt.x === destPt.x) {
      min = srcPt.y < destPt.y ? srcPt.y : destPt.y;
      max = srcPt.y + destPt.y - min;
      for (min++; min < max; min++) {
        if (!isEmpty(datas[srcPt.x][min])) {
          return false;
        }
      }
    } else {
      min = srcPt.x < destPt.x ? srcPt.x : destPt.x;
      max = srcPt.x + destPt.x - min;
      for (min++; min < max; min++) {
        if (!isEmpty(datas[srcPt.y][min])) {
          return false;
        }
      }
    }
    return true;
  }

  function matchBlockOne(datas, srcPt, destPt) {
    if (srcPt.x === destPt.x || srcPt.y === destPt.y) {
      return null;
    }
    var pt = new Point(srcPt.x, destPt.y);
    if (isEmpty(datas[pt.x][pt.y])) {
      var stMatch = matchBlock(datas, srcPt, pt);
      var tdMatch = stMatch ? matchBlock(datas, pt, destPt) : stMatch;
      if (stMatch && tdMatch) {
        return pt;
      }
    }
    pt = new Point(destPt.x, srcPt.y);
    if (isEmpty(datas[pt.x][pt.y])) {
      var stMatch = matchBlock(datas, srcPt, pt);
      var tdMatch = stMatch ? matchBlock(datas, pt, destPt) : stMatch;
      if (stMatch && tdMatch) {
        return pt;
      }
    }
    return null;
  }

  function matchBlockTwo(datas, srcPt, destPt) {
    if (!datas || !datas.length) {
      return null;
    }
    if (srcPt.x < 0 || srcPt.x > datas.length) {
      return null;
    }
    if (srcPt.y < 0 || srcPt.y > datas[0].length) {
      return null;
    }
    if (destPt.x < 0 || destPt.x > datas.length) {
      return null;
    }
    if (destPt.y < 0 || destPt.y > datas[0].length) {
      return null;
    }
    //0折连接
    if (matchBlock(datas, srcPt, destPt)) {
      return [];
    }
    var list = [],
      point = matchBlock(datas, srcPt, destPt);
    //1折连接
    if (point) {
      list.push(point);
      return list;
    }
    //2折连接
    var i;
    for (i = srcPt.y + 1; i < datas[srcPt.x].length; i++) {
      if (getTwoPoint(srcPt.x, i, list)) {
        if (list.length) {
          return list;
        }
      } else {
        break;
      }
    }
    for (i = srcPt.y - 1; i > -1; i--) {
      if (getTwoPoint(srcPt.x, i, list)) {
        if (list.length) {
          return list;
        }
      } else {
        break;
      }
    }
    for (i = srcPt.x + 1; i < datas.length; i++) {
      if (getTwoPoint(i, srcPt.y, list)) {
        if (list.length) {
          return list;
        }
      } else {
        break;
      }
    }
    for (i = srcPt.x - 1; i > -1; i--) {
      if (getTwoPoint(i, srcPt.y, list)) {
        if (list.length) {
          return list;
        }
      } else {
        break;
      }
    }
    return null;

    function getTwoPoint(x, y, list) {
      if (isEmpty(datas[x][y])) {
        var src = new Point(x, y);
        var dest = matchBlockOne(datas, src, destPt);
        if (dest) {
          list.push(src);
          list.push(dest);
        }
        return true;
      }
    }
  }
}(datas));
