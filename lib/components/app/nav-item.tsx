import React from 'react'
import styled from 'styled-components'

type Props = {
  children: React.ReactNode
  onClick: () => void
  title: string | undefined
}

export const NavbarButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  display: block;
  line-height: 20px;
  padding: 15px;
  transition: all 0.1s ease-in-out;

  &:hover,
  &[aria-expanded='true'] {
    background: rgba(0, 0, 0, 0.05);
    color: #ddd;
    cursor: pointer;
  }
  &.active {
    background: rgba(0, 0, 0, 0.05);
  }
`

const NavbarItem = ({ children, onClick, title }: Props): JSX.Element => {
  return (
    <li>
      <NavbarButton className="navItem" onClick={onClick} title={title}>
        {children}
      </NavbarButton>
    </li>
  )
}

export default NavbarItem
