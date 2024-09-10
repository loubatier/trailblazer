import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styled from "styled-components";
import useRosterCharacters from "../../lib/hooks/useRosterCharacters";
import { Character, Role } from "../../lib/types/planner/roster";
import { SpellFilter } from "../../lib/types/planner/timeline";

interface IProps {
  spellFilter: SpellFilter;
  onSpellFilterChange: (value: string) => void;
}

const Root = styled.div<{ isOpen: boolean }>`
  position: relative;
  width: 200px;
  background-color: #23262b;
  overflow: ${({ isOpen }) => (isOpen ? "unset" : "hidden")};
`;

const OptionSelected = styled.div<{ backgroundColor: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: ${({ backgroundColor }) => backgroundColor || "#FFFFFF"};
  cursor: pointer;
`;

const OptionsWrapper = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 7px 29px 0px;
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #23262b;
  transition: transform 0.16s ease-in-out;
`;

const Option = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor || "#FFFFFF"};
  overflow: hidden;
  cursor: pointer;

  &:hover ${OptionContent} {
    background-color: #202226;
    transform: translateX(4px);
  }
`;

const OptionIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const ChevronIcon = styled.div`
  display: flex;
  margin-left: auto;
`;

type SpellFilterOptions = {
  value: string;
  name: string;
  icon: string;
  bgColor: string;
};

const getSpellFilterOptions = (
  rosterCharacters: Character[]
): SpellFilterOptions[] => {
  const roleOptions: SpellFilterOptions[] = Object.values(Role).map((role) => ({
    value: String(role),
    name: role.charAt(0).toUpperCase() + role.slice(1),
    icon: `https://iworlfhhjaxteiqkjuut.supabase.co/storage/v1/object/public/icons/roles/${role}.webp`,
    bgColor: "#23262b",
  }));

  const characterOptions: SpellFilterOptions[] = rosterCharacters.map(
    (character) => ({
      value: character.id,
      name: character.name,
      icon: `https://iworlfhhjaxteiqkjuut.supabase.co/storage/v1/object/public/icons/specs/${character.specId}.webp`,
      bgColor: "white",
    })
  );

  return [...roleOptions, ...characterOptions];
};

const SpellFilterSelect = ({ onSpellFilterChange }: IProps) => {
  const { rosterCharacters } = useRosterCharacters(
    "7f640200-4659-4431-9dc6-23c659dc8be0"
  );

  const options = getSpellFilterOptions(rosterCharacters);

  const [currentOption, setCurrentOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <Root isOpen={isOpen}>
      <OptionSelected
        backgroundColor={"#23262b"}
        // backgroundColor={currentOption.bgColor}
        onClick={handleToggleOpen}
      >
        <OptionIcon src={currentOption.icon} />
        <span>{currentOption.name}</span>
        <ChevronIcon>{isOpen ? <ChevronUp /> : <ChevronDown />}</ChevronIcon>
      </OptionSelected>
      <OptionsWrapper>
        {options.map((option) => (
          <Option
            key={option.value}
            onClick={() => {
              setCurrentOption(option);
              onSpellFilterChange(option.value);
              handleToggleOpen();
            }}
            backgroundColor={option.bgColor}
          >
            <OptionContent>
              <OptionIcon src={option.icon} />
              <span>{option.name}</span>
            </OptionContent>
          </Option>
        ))}
      </OptionsWrapper>
    </Root>
  );
};

export default SpellFilterSelect;
