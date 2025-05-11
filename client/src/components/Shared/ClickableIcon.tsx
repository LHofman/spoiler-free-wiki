import { ActionIcon } from '@mantine/core';
import React, { FC } from 'react';

interface ClickableIconProps {
  icon: FC<{ color?: string }>,
  color: string,
  onClick: () => void,
}

function ClickableIcon(props: ClickableIconProps) {
  return (
    <ActionIcon variant='transparent' onClick={props.onClick}>
      { React.createElement(props.icon, { color: props.color }) }
    </ActionIcon>
  )
}

export default ClickableIcon;