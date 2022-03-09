/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { baseCharacters, baseSkill, baseType } from "../constants/characters";

// interface Character {
//   id: string;
//   cardId: string;
//   characterId: number;
//   name: string;
//   class: string;
//   typeId: number;
//   level: number;
//   baseColor: string;
//   skillId: number;
//   stats: {
//     power: number;
//     health: number;
//     speed: number;
//   };
//   description: string;
// }

function PocoCharacterDetail({
  id,
  characterId,
  characterTypeId,
}: {
  id: number;
  characterId: number;
  characterTypeId: number;
}) {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const [pocoData, setPocoData] = useState<any>({});

  let characterInitFilter: any =
    baseCharacters.filter(
      (character) =>
        character.characterId === characterId &&
        character.typeId === characterTypeId
    )[0] || null;

  // const getData = async () => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_LASTSVV_BASE_URL}/market/${id}`
  //     );
  //     if (!res.ok) throw new Error("request my-characters error");
  //     const result = await res.json();
  //     console.log(result);
  //     setPocoData(result);
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   if (visible && id) {
  //     getData();
  //   }
  // }, [visible, id]);

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Details
      </Button>
      <Drawer
        title={`NFT-${id}`}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <p className="text-3xl font-bold text-center">
          {characterInitFilter?.name}
        </p>
        <div className="flex justify-center w-full">
          {" "}
          <img
            src={`/assets/characters/${characterInitFilter?.id || "0101"}.png`}
            className="w-1/3 h-auto"
          />
        </div>

        <div className="grid mt-10">
          <table>
            <tbody>
              <tr>
                <td>
                  <p className="pr-10 font-bold capitalize">level</p>
                </td>
                <td>
                  <p className="capitalize">{characterInitFilter?.level}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="pr-10 font-bold capitalize">class</p>
                </td>
                <td>
                  <p className="capitalize">{characterInitFilter?.class}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="pr-10 font-bold capitalize">rarity</p>
                </td>
                <td>
                  <p className="capitalize">
                    {
                      baseType.filter((type) => type.id === characterTypeId)[0]
                        ?.rarity
                    }
                  </p>
                </td>
              </tr>
              {Object.keys(characterInitFilter?.stats).map(
                (i: string, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <p className="pr-10 font-bold capitalize">{i}</p>
                      </td>
                      <td>
                        <p className="capitalize">
                          {characterInitFilter?.stats[i]}
                        </p>
                      </td>
                    </tr>
                  );
                }
              )}
              <tr>
                <td>
                  <p className="pr-10 font-bold capitalize">skill</p>
                </td>
                <td>
                  <p>
                    <span className="mr-2 font-semibold capitalize">
                      {
                        baseSkill.filter(
                          (skill) => skill.id === characterInitFilter?.skillId
                        )[0]?.name
                      }
                    </span>
                    (
                    {
                      baseSkill.filter(
                        (skill) => skill.id === characterInitFilter?.skillId
                      )[0]?.description
                    }
                    )
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Drawer>
    </>
  );
}

export default PocoCharacterDetail;
