/*
 * @Author: yehuozhili
 * @Date: 2021-09-09 14:04:22
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-09 15:02:19
 * @FilePath: \carousel\src\Carousel\index.js
 */

import { useEffect, useMemo, useRef, useState } from "react";

function toMove(right, totalLen, indexMap, setIndexMap) {
  let y;
  if (right) {
    if (indexMap[1] < totalLen - 1) {
      y = indexMap[1] + 1;
    } else {
      y = 0;
    }
  } else {
    if (indexMap[1] === 0) {
      y = totalLen - 1;
    } else {
      y = indexMap[1] - 1;
    }
  }
  setIndexMap(currentSetMap(y, indexMap));
}

function currentSetMap(current, map) {
  let mid = map[1];
  if (mid === current) {
    return map;
  } else if (mid < current) {
    return [mid, current, -1];
  } else {
    return [-1, current, mid];
  }
}
function mapToState(map, children, totalLen) {
  if (totalLen <= 1) {
    return [null, children, null];
  } else {
    return map.map((v) => {
      if (v === -1) {
        return null;
      } else {
        let child = children;
        return child[v];
      }
    });
  }
}
const Transition = function (props) {
  const style = useMemo(() => {
    if (!props.animatein && props.direction === "left") {
      return { transform: `translateX(100%)` };
    }
    if (!props.animatein && props.direction === "right") {
      return { transform: `translateX(-100%)` };
    }
    if (props.animatein && props.direction === "left") {
      return { transform: `translateX(0)`, transition: "all 1s ease" };
    }

    if (props.animatein && props.direction === "right") {
      return { transform: `translateX(0)`, transition: "all 1s ease" };
    }
    return;
  }, [props]);

  return <div style={style}>{props.children}</div>;
};

const height = 200;

export function Carousel(props) {
  const [state, setState] = useState([]);
  const [indexMap, setIndexMap] = useState([-1, -1, -1]);
  //控制方向进出用
  const [animation, setAnimation] = useState({
    animatein: true,
    direction: "",
  });
  //设置宽度用
  const [bound, setBound] = useState();

  const totalLen = useMemo(() => {
    let len: number;
    if (props.children instanceof Array) {
      len = props.children.length;
    } else {
      len = 1;
    }
    return len;
  }, [props.children]);

  useMemo(() => {
    let map: [number, number, number] = [-1, -1, -1];
    map[1] = 0;
    let res = mapToState(map, props.children, totalLen);
    setState(res);
    setIndexMap(map);
  }, [props.children, totalLen]);

  useEffect(() => {
    let child = props.children;
    let timer;
    if (child) {
      let tmp = indexMap.map((v) => {
        return v !== -1 ? child[v] : null;
      });
      let sign;
      setState(tmp); //后setState会有补足问题必须先设

      if (indexMap[0] === -1 && indexMap[2] === -1) {
        //首轮
        return;
      } else if (indexMap[0] === -1) {
        sign = true;
        setAnimation({ animatein: false, direction: "right" });
      } else {
        sign = false;
        setAnimation({ animatein: false, direction: "left" });
      }
      timer = window.setTimeout(() => {
        if (sign) {
          setAnimation({ animatein: true, direction: "right" });
        } else {
          setAnimation({ animatein: true, direction: "left" });
        }
      }, 500);
    }
    return () => window.clearTimeout(timer);
  }, [indexMap, props.children]);

  const ref = useRef(null);
  useEffect(() => {
    const setBoundFunc = () => {
      if (ref.current) {
        let bounds = ref.current.getBoundingClientRect();
        setBound(bounds);
      }
    };
    setBoundFunc();
    const resizefunc = () => {
      setBoundFunc();
    };
    window.addEventListener("resize", resizefunc);
    return () => {
      window.removeEventListener("resize", resizefunc);
    };
  }, []);

  useEffect(() => {
    let timer;
    timer = window.setTimeout(() => {
      toMove(true, totalLen, indexMap, setIndexMap);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [indexMap, totalLen]);

  return (
    <div ref={ref}>
      <div
        className="viewport"
        style={{
          width: `100%`,
          height: `${height}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Transition
          animatein={animation.animatein}
          direction={animation.direction}
        >
          <div
            style={{
              display: "flex",
              width: `${bound?.width * 3}px`,
              position: "absolute",
              left: `${-bound?.width}px`,
            }}
          >
            {state.map((v, i) => (
              <div
                key={i}
                style={{
                  height: `${height}px`,
                  width: `${bound?.width}px`,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </Transition>
      </div>
      <div>
        <button
          onClick={() => {
            toMove(true, totalLen, indexMap, setIndexMap);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            toMove(false, totalLen, indexMap, setIndexMap);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
}
