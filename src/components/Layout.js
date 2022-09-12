import React from "react";
import { useState, useEffect } from "react";
import Table from "../components/Table";
function Layout(props) {
  const { data } = props;
  // const extractedData = data;
  // console.log(extractedData[0]);
  // console.log(data);
  //go-dev.greedygame.com/v3/dummy/apps
  const [map, setMap] = useState();
  useEffect(() => {
    fetch(" http://go-dev.greedygame.com/v3/dummy/apps")
      .then((response) => response.json())
      .then((data) => {
        const map = new Map();
        const apps = data.data;
        for (let i = 0; i < apps.length; ++i) {
          map.set(apps[i]["app_id"], apps[i]["app_name"]);
        }
        setMap(map);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  let mainData = data.data;
  if (map) {
    // for(let i=0;i<mainData.length;++i)
    for (let i = 0; i < mainData.length; ++i) {
      mainData[i]["app_name"] = map.get(mainData[i]["app_id"]);
    }
  }

  return <div>{mainData ? <Table data={mainData} /> : ""}</div>;
}

export default Layout;
