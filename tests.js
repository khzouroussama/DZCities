import { readFile, writeFile } from "fs/promises";

const checkFiles = async () => {
  let cities_missed = JSON.parse(await readFile("cities_missed.json", "utf-8"));
  let cities_proceced = JSON.parse(
    await readFile("cities_proceced.json", "utf-8")
  );
  console.log(
    cities_missed.filter((x) => x?.longitude && x?.latitude).length,
    cities_missed.length
  );
};

const checkValidityOfData = async () => {
  let cities_proceced = JSON.parse(
    await readFile("cities_proceced.json", "utf-8")
  );

  console.log(
    cities_proceced.filter((x) => x?.longitude && x?.latitude).length,
    cities_proceced.length
  );

  console.log(cities_proceced.filter((x) => !x?.longitude || !x?.latitude));
};

checkValidityOfData();
