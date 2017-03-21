import React from "react";
import { Header, Textfield } from "react-mdl";

const MyHeader = ({ searchValue, handleSearchChange, handleSearchKeys }) => {
  return (
    <Header title="Home">
      <Textfield
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeys}
        label="Search"
        expandable
        expandableIcon="search"
      />
    </Header>
  );
};

export default MyHeader;
