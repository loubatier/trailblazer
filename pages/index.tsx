import React, { useEffect, useState } from "react";
import { deburr, isEmpty, kebabCase } from "lodash";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";
import { Button, Input, Main, Select, Title } from "../components/sharedstyles";
import { useGuildData } from "../lib/hooks/useGuildData";
import { useRealmsData } from "../lib/hooks/useRealmsData";
import { useGuildStore } from "../lib/stores/useGuildStore";

const Root = styled(Main)`
  display: flex;
  background-image: url("/app-background.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
`;

const ContentWrapper = styled.div`
  margin: auto;
`;

const Home = () => {
  const { data: session } = useSession();
  const { currentGuild } = useGuildStore();

  const regions = [
    { value: "us", name: "US" },
    { value: "eu", name: "EU" },
    { value: "kr", name: "KR" },
    { value: "tw", name: "TW" },
  ];

  const [realms, setRealms] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRealm, setSelectedRealm] = useState("");
  const [guildName, setGuildName] = useState("");

  const {
    data: guild,
    error: errorGuild,
    refetch,
  } = useGuildData(
    selectedRegion,
    kebabCase(deburr(selectedRealm)),
    kebabCase(deburr(guildName))
  );

  const { data: realmsData, isLoading: isLoadingRealms } =
    useRealmsData(selectedRegion);

  useEffect(() => {
    if (realmsData) setRealms(realmsData.realms);
  }, [realmsData]);

  const handleRegionInputChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleRealmInputChange = (event) => {
    setSelectedRealm(event.target.value);
  };

  const handleGuildInputChange = (event) => {
    setGuildName(event.target.value);
  };

  if (session) {
    return (
      <Root>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ContentWrapper>
          <Title>Trailblazer</Title>

          {!currentGuild && (
            <>
              <Select
                value={selectedRegion || ""}
                onChange={handleRegionInputChange}
              >
                <option value="" disabled hidden>
                  Select a region
                </option>
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.name}
                  </option>
                ))}
              </Select>
              {realms && (
                <Select
                  disabled={isLoadingRealms || isEmpty(realms)}
                  value={selectedRealm || ""}
                  onChange={handleRealmInputChange}
                >
                  <option value="" disabled hidden>
                    Select a realm
                  </option>
                  {realms.map((realm) => (
                    <option key={realm.value} value={realm.slug}>
                      {realm.name}
                    </option>
                  ))}
                </Select>
              )}
              <Input
                type="text"
                placeholder="Enter text here"
                value={guildName}
                onChange={handleGuildInputChange}
              />
              <Button onClick={() => refetch()}>Fetch guild</Button>

              {guild && (
                <div>
                  <h3>Guild Data:</h3>
                  <p>
                    {guild.name} - {guild.realm.name} {guild.member_count}{" "}
                    members
                  </p>
                </div>
              )}
              {errorGuild && <div>{errorGuild.message}</div>}
            </>
          )}

          {currentGuild && <p>Accueil de la guilde {currentGuild.name}</p>}
        </ContentWrapper>
      </Root>
    );
  }
  return (
    <Main>
      Not signed in <br />
      <p onClick={() => signIn()}>Sign in</p>
    </Main>
  );
};

export default Home;
