export type Roster = {
  id: string;
  guildId: string;
  name: string;
};

export type Character = {
  id: string;
  rosterId: string;
  name: string;
  specId: string;
  classId: string;
};

export type Class = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export type Spec = {
  id: string;
  classId: string;
  name: string;
  slug: string;
  color: string;
};

export enum Role {
  Everyone = "everyone",
  Tank = "tank",
  Heal = "heal",
  Melee = "melee",
  Ranged = "range",
}

export const roleSpecMapping: { [key: string]: string[] } = {
  tank: [
    "395d5780-d74c-42ce-9226-944073d6a970",
    "9964a671-27de-4e1f-9492-e261f3442d6d",
    "702851b3-14d5-409c-ad11-69d423fff8f6",
    "c792bfde-8bdb-43eb-9250-ca7d500fcba0",
    "cb1b941d-85c3-4f6f-b854-5e322703d279",
    "e0ecbe43-bc98-4c60-9650-25fed6313450",
  ],
  heal: [
    "087aa723-8db9-4013-97cc-c10687c0f249",
    "32a94e1c-7aaf-4f8d-833e-b981d877a1a9",
    "603de0a9-7873-43d3-9a06-fa27193772cd",
    "a2a1d73e-d7eb-42f2-aa8b-8836885f2558",
    "b2dac8a5-e672-41ea-b339-741b6a7ccd30",
    "b506ba02-3b20-499e-a060-6eda0975bbc6",
    "e9af1c2c-a415-4060-bc88-0fba453203d4",
  ],
  melee: [
    "02f3bc98-5d43-4b7d-a864-df5f037e197a",
    "07b5b662-c304-40ab-9c3f-dfd3422a8af0",
    "41178162-40b0-4fd6-bd2b-ca15f9f6e3a5",
    "6e8021b4-6ef2-4791-b2c7-fbfeaa980c99",
    "74600ad8-11bf-4ce7-8d31-d330d7400217",
    "850f97a6-1999-43f2-a044-7f6d4a6b88d0",
    "952f6286-f050-4ecb-8226-a0e63281b90e",
    "a081496a-6931-455e-b0c7-59ce245e2f59",
    "a6bcdfa2-d38d-4ce2-9ac6-f38e7d6c9f88",
    "d0aee65e-5ad3-45c2-ba58-05c7dec2c008",
    "e4dde449-0447-4797-afa9-7fa6f157e608",
    "ef50a2bf-087a-40e1-a08b-528344a3ef04",
    "fb0cf0ed-fabe-4f47-be02-2768472c38da",
  ],
  range: [
    "06d25069-e1d6-4243-8c02-fcc80374d8e2",
    "2552c697-ee0d-4a7f-b0d0-51499bf09a09",
    "329c816c-4ddc-49a5-8f37-36aee2b19c37",
    "33a7a8d7-81f5-4dd2-9d79-cc831c082342",
    "347ffa20-4b14-4085-8b4a-624b4681ccfa",
    "5d9471ea-3104-457d-9b57-ca814b787d0a",
    "610f860e-7e43-4d20-9a8c-7171605edc90",
    "7aa4813d-6738-4089-9fa9-10058743c4f3",
    "8f0b82ba-c7d6-4978-8fe3-7e3e7600986e",
    "afb4c392-24f1-43d2-9a3e-2eb5b7304a85",
    "c9837805-5e16-43ef-b463-dc7023fc5c4d",
    "cbf21d23-11c3-4cf0-8bbf-55911599cf1e",
    "df9eb8f2-fc75-420c-a3b5-2c3a8c7a2405",
  ],
};
