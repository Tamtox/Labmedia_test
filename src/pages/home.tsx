/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import '@/styles/home.scss';

import axios from 'axios';
import React, { useEffect, useMemo, useReducer } from 'react';
import { AiOutlineClear } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import Input from '@/components/input/input';
import Loading from '@/components/loading/Loading';
import Modal from '@/components/modal/modal';
import { IUsersStore, useUserStore } from '@/store/user_store';
import { IUser } from '@/types/types';

interface IHomeState {
  searchQuery: string;
  sortQuery: string;
  page: string;
  modalOpen: boolean;
  userId: string;
}

// Filter by search query or sort query
function filterUsers(users: IUser[], searchQuery: string, sortQuery: string) {
  let result: IUser[] = [...users];
  if (searchQuery) {
    const searchLow = searchQuery.toLowerCase();
    result = result.filter((user: IUser) => {
      if (user.email.toLowerCase().includes(searchLow) || user.username.toLowerCase().includes(searchLow)) {
        return user;
      }
    });
  }
  if (sortQuery) {
    if (sortQuery === 'regDateAsc') {
      result = result.sort(
        (itemA: IUser, itemB: IUser) =>
          new Date(itemA.registration_date).getTime() - new Date(itemB.registration_date).getTime(),
      );
    } else if (sortQuery === 'regDateDesc') {
      result = result.sort(
        (itemA: IUser, itemB: IUser) =>
          new Date(itemB.registration_date).getTime() - new Date(itemA.registration_date).getTime(),
      );
    } else if (sortQuery === 'ratingAsc') {
      result = result.sort((itemA: IUser, itemB: IUser) => Number(itemA.rating) - Number(itemB.rating));
    } else if (sortQuery === 'ratingDesc') {
      result = result.sort((itemA: IUser, itemB: IUser) => Number(itemB.rating) - Number(itemA.rating));
    }
  }
  return result;
}

const Home: React.FC = (): JSX.Element => {
  const { users, filteredUsers, currentPage, loading, setUsers, setFilteredUsers, deleteUser, setPage, setLoading } =
    useUserStore((state: IUsersStore) => state);
  // State
  const [state, setState] = useReducer(
    (state: IHomeState, action: Partial<IHomeState>) => ({
      ...state,
      ...action,
    }),
    {
      searchQuery: '',
      sortQuery: '',
      page: '1',
      modalOpen: false,
      userId: '',
    },
  );
  // Search handler
  const searchInputHandler = (newSearchQuery: string) => {
    setState({ searchQuery: newSearchQuery });
    const filteredUsers = filterUsers(users, newSearchQuery, state.sortQuery);
    setFilteredUsers(filteredUsers);
  };
  // Sort Handler
  const sortHandler = (newSortQuery: string) => {
    setState({ sortQuery: newSortQuery });
    const filteredUsers = filterUsers(users, state.searchQuery, newSortQuery);
    setFilteredUsers(filteredUsers);
  };
  // Clear queries
  const clearQueries = () => {
    setState({ searchQuery: '', sortQuery: '' });
    setFilteredUsers(users);
  };
  // Toggle modal
  const toggleModalHandler = (userId = '') => {
    setState({ modalOpen: !state.modalOpen, userId });
  };
  // Pagination
  const paginationHandler = (direction: string) => {
    const isLastPage = Math.ceil(filteredUsers.length / 5) === currentPage;
    if (direction === 'left' && currentPage > 1) {
      setPage(currentPage - 1);
    } else if (direction === 'right' && !isLastPage) {
      setPage(currentPage + 1);
    }
  };
  // Load users
  const getUsers = async () => {
    setLoading(true);
    try {
      const users: { data: IUser[] } = await axios.request({
        url: 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users',
        method: 'GET',
      });
      const { data } = users;
      setUsers(data);
    } catch (error) {
      axios.isAxiosError(error) ? alert(error.response?.data || error.message) : console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="home">
      {state.modalOpen ? (
        <Modal userId={state.userId} deleteUser={deleteUser} open={state.modalOpen} onClose={toggleModalHandler} />
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
        {state.searchQuery || state.sortQuery ? (
          <div className={`search__clear`} onClick={clearQueries}>
            <AiOutlineClear className={`icon`} />
            <p>Очистить фильтр</p>
          </div>
        ) : null}
      </div>
      <div className={`sort color--gray`}>
        <p className={`sort__title`}>Сортировка:</p>
        <p
          className={`sort__select ${state.sortQuery.includes('regDate') && 'active'}`}
          onClick={() => {
            sortHandler(state.sortQuery === 'regDateAsc' ? 'regDateDesc' : 'regDateAsc');
          }}
        >
          Дата регистрации
        </p>
        <p
          className={`sort__select ${state.sortQuery.includes('rating') && 'active'}`}
          onClick={() => {
            sortHandler(state.sortQuery === 'ratingAsc' ? 'ratingDesc' : 'ratingAsc');
          }}
        >
          Рейтинг
        </p>
      </div>
      {loading ? (
        <Loading height="70vh" />
      ) : (
        <>
          <div className={`list`}>
            <table className={`list__table`}>
              <tr className={`list__table__row`}>
                <th className={`row__element`}>Имя пользователя</th>
                <th className={`row__element`}>E-mail</th>
                <th className={`row__element`}>Дата регистрации</th>
                <th className={`row__element`}>Рейтинг</th>
                <th className={`row__element`}></th>
              </tr>
              {filteredUsers.map((user: IUser, index: number) => {
                if (index < currentPage * 5 && index >= (currentPage - 1) * 5) {
                  return (
                    <tr key={user.id} className={`list__table__row`}>
                      <td className={`username row__element color--teal`}>{user.username}</td>
                      <td className={`emai row__element`}>{user.email}</td>
                      <td className={`registration-date row__element`}>
                        {new Date(user.registration_date).toLocaleDateString()}
                      </td>
                      <td className={`rating row__element`}>{user.rating}</td>
                      <td className={`delete row__element`}>
                        <span
                          className={`icon-container`}
                          onClick={() => {
                            toggleModalHandler(user.id);
                          }}
                        >
                          <IoClose className={`icon`} />
                        </span>
                      </td>
                    </tr>
                  );
                }
              })}
            </table>
          </div>
          <div className={`pagination`}>
            <div
              className={`pagination__prev icon-container`}
              onClick={() => {
                paginationHandler('left');
              }}
            >
              <FaRegArrowAltCircleLeft className={`icon`} />
            </div>
            <div>{currentPage}</div>
            <div
              className={`pagination__next icon-container`}
              onClick={() => {
                paginationHandler('right');
              }}
            >
              <FaRegArrowAltCircleRight className={`icon`} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
