import styled from "styled-components";
import { EClassColor, RosterPlayer } from "../../data/models/roster";
import { lowerCase } from "lodash";
import { replaceWhitespaceWithUnderscore } from "../../lib/utils";
import { Clock, Cross, X, XCircle, XSquare } from "lucide-react";

interface IProps {
  player: RosterPlayer;
  status?: string;
}

const StatusIcon = styled.div`
  display: flex;
  margin-left: auto;
`;

const Root = styled.div<{ color: string; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 200px;
  height: 48px;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.colors.content_background};
  border-left: 4px solid ${({ color }) => color};

  p {
    font-size: 16px;
    font-weight: bold;
  }

  img,
  p {
    opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  }
`;

const Player: React.FC<IProps> = ({ player, status }) => {
  const isBenchedOrAbsent = status === "benched" || status === "absent";
  console.log(isBenchedOrAbsent);
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
        <StatusIcon>
          {status === "benched" && <XCircle color="#E73C3C" />}
          {status === "absent" && <Clock color={"#E7843C"} />}
        </StatusIcon>
      )}
    </Root>
  );
};

export default Player;
