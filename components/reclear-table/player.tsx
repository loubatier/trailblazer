import styled from "styled-components";
import { EClassColor, RosterPlayer } from "../../data/models/roster";
import { lowerCase } from "lodash";
import { replaceWhitespaceWithUnderscore } from "../../lib/utils";
import { CalendarX2, Sofa } from "lucide-react";

interface IProps {
  player: RosterPlayer;
  status?: string;
}

const StatusIcon = styled.div<{ color: string }>`
  display: flex;
  margin-left: auto;
  padding: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => `${color}20`};
`;

const Root = styled.div<{ color: string; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 200px;
  height: 48px;
  padding: 0 12px;

  ${({ theme, isDisabled, color }) => {
    const backgroundColor = isDisabled
      ? `${theme.colors.content_background}50`
      : theme.colors.content_background;
    const borderColor = isDisabled ? `${color}50` : color;
    const contentOpacity = isDisabled ? "0.5" : "1";

    return `
      background-color: ${backgroundColor};
      border-left: 4px solid ${borderColor};
      p, img {
        opacity: ${contentOpacity};
      }
    `;
  }}

  p {
    font-size: 16px;
    font-weight: bold;
  }
`;

const Player: React.FC<IProps> = ({ player, status }) => {
  const isBenchedOrAbsent = status === "benched" || status === "absent";

  console.log("PLAYER", player);
  return (
    <Root
      color={EClassColor[replaceWhitespaceWithUnderscore(player.class)]}
      isDisabled={isBenchedOrAbsent}
    >
      <img
        src={`/classes/${replaceWhitespaceWithUnderscore(
          lowerCase(player.class)
        )}.webp`}
        alt={`${player.class} icon`}
        width={24}
        height={24}
      />

      <p>{player.name}</p>

      {status && (
        <StatusIcon color={status === "benched" ? "#E73C3C" : "#E7843C"}>
          {status === "benched" && <Sofa color="#E73C3C" size={16} />}
          {status === "absent" && <CalendarX2 color={"#E7843C"} size={16} />}
        </StatusIcon>
      )}
    </Root>
  );
};

export default Player;
