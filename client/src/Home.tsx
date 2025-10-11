import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const[bab,setBab]=useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((perv) => perv + 1);
    }, 100);
  },[bab]);

  return (
    <>
      <button onClick={()=>setBab(cur=>cur+1)}>kuttr</button>
      <h1>{count}</h1>
      <h1 className="text-red-700">{bab}</h1>
    </>
  );
}
