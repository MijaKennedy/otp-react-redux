import React from 'react'
import styled from 'styled-components'

type Props = {
  children: React.ReactNode
  className?: string
  onClick: () => void
  title: string | undefined
}

export const NavbarButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.75);
  display: block;
  line-height: 20px;
  padding: 15px;
  transition: all 0.1s ease-in-out;

  @media (max-width: 768px) {
    padding: 10px;
    float: right;
  }
  &:hover,
  &[aria-expanded='true'] {
    background: rgba(0, 0, 0, 0.05);
    color: #222;
    cursor: pointer;
  }
  &.active {
    background: rgba(0, 0, 0, 0.05);
  }
`

const NavbarItem = ({
  children,
  className,
  onClick,
  title
}: Props): JSX.Element => {
  return (
    <li className={className}>
      <NavbarButton className="navItem" onClick={onClick} title={title}>
        {children}
      </NavbarButton>
    </li>
  )
}

export default NavbarItem
