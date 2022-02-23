import { Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";

function PocoCharacterDetail({ id }: { id: number }) {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const [pocoData, setPocoData] = useState<any>({});

  async function getData() {
    const res = await fetch("https://api.pocoland.com/meta/" + id);
    const data = await res.json();
    console.log(
      "🚀 ~> file: PocoCharacterDetail.tsx ~> line 16 ~> getData ~> data",
      data
    );
    setPocoData(data);
    return data;
  }
  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Details
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <p className="text-3xl font-bold text-center">{pocoData.name}</p>
        <img src={pocoData.image} />

        <div className="grid">
          <table>
            <tbody>
              {pocoData.attributes?.map((i: any) => (
                <tr key={i.trait_type}>
                  <td>
                    <p className="font-bold">{i.trait_type}</p>
                  </td>
                  <td>{i.value}</td>
                  <td>
                    {i.image && <img src={i.image} width={24} height={24} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Drawer>
    </>
  );
}

export default PocoCharacterDetail;
