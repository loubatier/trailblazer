import { useEffect, useState } from "react";
import styled from "styled-components";

interface IProps {
  children: React.ReactNode;
}

enum ETransitionStage {
  FADE_IN = "fadeIn",
  FADE_OUT = "fadeOut",
}

const Root = styled.div<{ transitionStage: string }>`
  opacity: ${(props) =>
    props.transitionStage === ETransitionStage.FADE_IN ? 1 : 0};
  background-color: cornflowerblue;
  transition: 1s;
`;

const Curtain = styled.div<{ transitionStage: string }>`
  background-color: green;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  transition: 1s;
  transform: ${(props) =>
    props.transitionStage === ETransitionStage.FADE_IN
      ? `translateX(100%)`
      : `translateX(0)`};
  left: 0;
`;

const TransitionLayout: React.FC<IProps> = ({ children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState(
    ETransitionStage.FADE_OUT
  );

  useEffect(() => {
    setTransitionStage(ETransitionStage.FADE_IN);
  }, []);

  useEffect(() => {
    if (children !== displayChildren)
      setTransitionStage(ETransitionStage.FADE_OUT);
  }, [children, setDisplayChildren, displayChildren]);

  const onTransitionEnd = () => {
    if (transitionStage === ETransitionStage.FADE_OUT) {
      setDisplayChildren(children);
      setTransitionStage(ETransitionStage.FADE_IN);
    }
  };

  return (
    <Root onTransitionEnd={onTransitionEnd} transitionStage={transitionStage}>
      <Curtain transitionStage={transitionStage} />
      {displayChildren}
    </Root>
  );
};

export default TransitionLayout;
