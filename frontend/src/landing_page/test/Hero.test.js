import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Hero from "../home/Hero";

describe("Hero Component", () => {
  test("renders Hero component", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const heroImage = screen.getByAltText("Hero");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "images/homeHero.png");
  });

  test("renders signup link", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const signupLink = screen.getByRole("link", { name: /Sign up for free/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/signup");
    expect(signupLink).toHaveClass("btn-primary");
  });
});