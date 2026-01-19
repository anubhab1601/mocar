"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "All Cars" },
  { href: "/bikes", label: "All Bikes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <a href="tel:9090610116">
              <i className="fas fa-phone" /> 9090610116
            </a>
            <a href="tel:+917978624414">
              <i className="fab fa-whatsapp" /> 7978624414
            </a>
          </div>
          <div className="top-bar-right">
            <span className="info-item">
              <i className="fas fa-clock" /> Mon-Sun 09:00 - 23:00
            </span>
            <a href="mailto:info@mocar.co.in">
              <i className="fas fa-envelope" /> info@mocar.co.in
            </a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <Link href="/">
                <img src="/mo_car_logo.png" alt="MoCar Logo" />
              </Link>
            </div>

            <ul className={`nav-menu ${navOpen ? "active" : ""}`}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={pathname === href ? "active" : ""}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`hamburger ${navOpen ? "active" : ""}`}
              onClick={() => setNavOpen((open) => !open)}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
            >
              <span />
              <span />
              <span />
            </button>

            <div style={{ marginLeft: "20px", minWidth: "100px" }}>
              {mounted && (
                isAdmin ? (
                  <button
                    onClick={logout}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.9rem", padding: "8px 16px" }}
                  >
                    <i className="fas fa-sign-out-alt" /> Logout
                  </button>
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="btn btn-primary"
                    style={{ fontSize: "0.9rem", padding: "8px 16px" }}
                  >
                    <i className="fas fa-lock" /> Admin
                  </button>
                )
              )}
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
