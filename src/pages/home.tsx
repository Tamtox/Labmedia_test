import "@/styles/home.scss";

import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { BsSearch } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import Input from "@/components/input/input";
import Modal from "@/components/modal/modal";
import { IUsersStore, useUserStore } from "@/store/user_store";
import { IUser } from "@/types/types";

interface IHomeState {
  searchQuery: string;
  sortQuery: string;
  page: string;
  modalOpen: boolean;
}

// Filter by search query or sort query
function filterUsers(users: IUser[], searchQuery: string, sortQuery: string) {
  let result: IUser[] = [...users];
  if (searchQuery) {
    const searchLow = searchQuery.toLowerCase();
    result = result.filter((user: IUser) => {
      if (
        user.email.toLowerCase().includes(searchLow) ||
        user.username.toLowerCase().includes(searchLow)
      ) {
        return user;
      }
    });
  }
  if (sortQuery) {
    if (sortQuery === "Registration date") {
      result = result.sort(
        (itemA: IUser, itemB: IUser) =>
          new Date(itemA.registration_date).getTime() -
          new Date(itemB.registration_date).getTime()
      );
    } else if (sortQuery === "Rating") {
      result = result.sort(
        (itemA: IUser, itemB: IUser) =>
          Number(itemA.rating) - Number(itemB.rating)
      );
    }
  }
  return result;
}

const Home: React.FC = (): JSX.Element => {
  const { users, filteredUsers, setUsers, setFilteredUsers } = useUserStore(
    (state: IUsersStore) => state
  );
  const [state, setState] = useReducer(
    (state: IHomeState, action: Partial<IHomeState>) => ({
      ...state,
      ...action,
    }),
    {
      searchQuery: "",
      sortQuery: "",
      page: "1",
      modalOpen: false,
    }
  );
  // Search handler
  const searchInputHandler = (newVal: string) => {
    setState({ searchQuery: newVal });
    const filteredUsers = filterUsers(users, newVal, state.sortQuery);
    setFilteredUsers(filteredUsers);
  };
  // Sort Handler
  const sortHandler = (newVal: string) => {
    setState({ sortQuery: newVal });
    const filteredUsers = filterUsers(users, state.searchQuery, newVal);
    setFilteredUsers(filteredUsers);
  };
  // Toggle modal
  const toggleModalHandler = () => {
    setState({ modalOpen: !state.modalOpen });
  };
  // Load users
  const getUsers = async () => {
    const users: { data: IUser[] } = await axios.request({
      url: "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users",
      method: "GET",
    });
    const { data } = users;
    setUsers(data);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="home">
      {state.modalOpen ? (
        <Modal open={state.modalOpen} onClose={toggleModalHandler} />
      ) : null}
      <h3 className={`title`}>Список пользователей</h3>
      <div className={`search`}>
        <Input
          value={state.searchQuery}
          onChange={searchInputHandler}
          placeholder="Поиск по имени или e-mail"
          className={`search__input`}
        >
          {state.searchQuery ? null : <BsSearch />}
        </Input>
        <div className={`search__clear`}>
          <img src="../assets/icon/Vector 4.svg" alt="" />
          <p>Очистить фильтр</p>
        </div>
      </div>
      <div className={`sort`}></div>
      <div className={`list`}>
        <table className={`list__table`}>
          <tr className={`list__table__row`}>
            <td className={`row__element`}>Имя пользователя</td>
            <td className={`row__element`}>E-mail</td>
            <td className={`row__element`}>Дата регистрации</td>
            <td className={`row__element`}>Рейтинг</td>
            <td className={`row__element`}></td>
          </tr>
          {filteredUsers.map((user: IUser) => {
            /* eslint-disable-next-line react/jsx-key*/
            return (
              <tr key={user.id} className={`list__table__row`}>
                <td className={`username row__element color--teal`}>
                  {user.username}
                </td>
                <td className={`emai row__element`}>{user.email}</td>
                <td className={`registration-date row__element`}>
                  {new Date(user.registration_date).toLocaleDateString()}
                </td>
                <td className={`rating row__element`}>{user.rating}</td>
                <td className={`delete row__element`}>
                  <span
                    className={`icon-container`}
                    onClick={toggleModalHandler}
                  >
                    <IoClose className={`icon`} />
                  </span>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default Home;
