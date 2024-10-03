"use client";

import styled from "styled-components";
import { AkeneoIcon, BarChartsIcon, MainNavigationItem, SystemIcon } from "akeneo-design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 80px;
  height: 100vh;
  border-right: 1px solid #f0f1f3;
  color: #a1a9b7;
`;

export default function SideNav() {
  const pathname = usePathname();
  return (
    <Nav>
      <Link href={"/"}>
        <AkeneoIcon width="40" height="40" className="m-4 mb-4" color="green" />
      </Link>
      <Link href={"/"}>
        <MainNavigationItem icon={<BarChartsIcon />} active={"/" === pathname}>
          Home
        </MainNavigationItem>
      </Link>
      <Link href={"/system"}>
        <MainNavigationItem href="#" icon={<SystemIcon />} active={"/system" === pathname}>
          System
        </MainNavigationItem>
      </Link>
    </Nav>
  );
}
