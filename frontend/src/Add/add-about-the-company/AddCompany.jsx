import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../style/style-card.module.scss';

import {
  fetchStaffAsync,
  deleteStaffAsync,
  toggleVisibilityStaffAsync,
  reorderStaffAsync,
} from '../../store/Slice/StaffSliceNew';

import { fetchStaffCategoryTogglesAsync, updateStaffCategoryToggleAsync } from '../../store/Slice/toggleSlice';

import StaffForm from './StaffForm';
import Edit from '../icon/Edit.svg';
import Look from '../icon/eye.svg';
import NoLook from '../icon/eye2.svg';
import defaultPhoto from '../../img/default-photo.jpeg';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const CATEGORY_OPTIONS = ['Руководство', 'Научное сопровождение', 'HR'];
const CAT_EQUIV = {
  'Научное сопровождение': ['Научное сопровождение', 'Научно-техническое сопровождение'],
};
const CAT_KEYS = {
  Руководство: 'leadership',
  'Научное сопровождение': 'science',
  HR: 'hr',
};

function Toggle({ on, onClick, style }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        width: 44,
        height: 24,
        borderRadius: 24,
        background: on ? '#75BBFD' : '#e5e7eb',
        cursor: 'pointer',
        transition: 'background 150ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 2,
        ...style,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transform: `translateX(${on ? 20 : 0}px)`,
          transition: 'transform 150ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
    </div>
  );
}

export default function AddCompany({ user }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.staff);
  const staffCats = useSelector((s) => s.toggle.staffCats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({});
  const [modalBlockHeight, setModalBlockHeight] = useState('auto');
  const [activeIdx, setActiveIdx] = useState(0);
  const [orderIds, setOrderIds] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [dirty, setDirty] = useState(false);

  const [cols, setCols] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    if (w < 1100) return 2;
    if (w >= 3000) return 4;
    return 3;
  });

  const isMountedRef = useRef(true);

  const uname = String(user?.name ?? user?.userName ?? '').trim();

  const canDelete = uname === 'obezyankaa' || uname === 'Pokemon';
  const canEdit = uname === 'obezyankaa' || uname === 'manager' || uname === 'Pokemon';
  const canToggle = uname === 'obezyankaa' || uname === 'Pokemon' || uname === 'manager';

  useEffect(() => {
    dispatch(fetchStaffAsync());
    dispatch(fetchStaffCategoryTogglesAsync());
  }, [dispatch]);

  const updateModalBlockHeight = useCallback(() => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900);
    setModalBlockHeight(`${maxHeight}px`);
  }, []);

  const handleResize = useCallback(() => {
    const w = window.innerWidth;
    if (w < 1100) setCols(2);
    else if (w >= 3000) setCols(4);
    else setCols(3);
  }, []);

  useEffect(() => {
    updateModalBlockHeight();
    handleResize();
    window.addEventListener('resize', updateModalBlockHeight);
    window.addEventListener('resize', handleResize);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', updateModalBlockHeight);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateModalBlockHeight, handleResize]);

  const photoSrc = (row) => {
    const name = row?.img;
    if (!name) return defaultPhoto;
    if (/^https?:\/\//i.test(String(name))) return name;
    return `${bucket_url}/images/imageStuff/${name}`;
  };

  const filtered = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    const selected = CATEGORY_OPTIONS[activeIdx];
    const synonyms = CAT_EQUIV[selected] || [selected];
    const norm = (s) =>
      String(s || '')
        .toLowerCase()
        .trim();
    return list.filter((it) => (it.category || []).some((c) => synonyms.map(norm).includes(norm(c))));
  }, [items, activeIdx]);

  const ordered = useMemo(() => {
    const arr = [...filtered].map((it) => ({
      ...it,
      isVisible: typeof it.isVisible === 'boolean' ? it.isVisible : true,
    }));
    arr.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [filtered]);

  useEffect(() => {
    const currentCat = CATEGORY_OPTIONS[activeIdx];
    const currentKey = CAT_KEYS[currentCat];
    if (staffCats[currentKey]) {
      const firstOnIdx = CATEGORY_OPTIONS.findIndex((c) => !staffCats[CAT_KEYS[c]]);
      setActiveIdx(firstOnIdx === -1 ? 0 : firstOnIdx);
    }
  }, [staffCats, activeIdx]);

  useEffect(() => {
    setOrderIds(ordered.map((x) => x.id));
    setDirty(false);
  }, [ordered]);

  const openAddModal = useCallback(() => {
    setEditData(null);
    setIsModalOpen(true);
  }, []);
  const openEditModal = useCallback((row) => {
    setEditData(row);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const openDeleteModal = useCallback((id) => setDeleteModalState((p) => ({ ...p, [id]: true })), []);
  const closeDeleteModal = useCallback((id) => {
    setDeleteModalState((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  }, []);
  const confirmDelete = useCallback(
    (id) => {
      dispatch(deleteStaffAsync(id));
      closeDeleteModal(id);
    },
    [dispatch, closeDeleteModal]
  );

  const handleLookClick = useCallback(
    (row) => {
      const current = typeof row.isVisible === 'boolean' ? row.isVisible : true;
      dispatch(toggleVisibilityStaffAsync({ id: row.id, isVisible: !current }));
    },
    [dispatch]
  );

  const handleFilterClick = (index) => {
    const cat = CATEGORY_OPTIONS[index];
    const key = CAT_KEYS[cat];
    if (staffCats[key]) return;
    setActiveIdx(index);
  };

  const moveId = (ids, fromId, toId) => {
    if (fromId === toId) return ids;
    const next = ids.slice();
    const from = next.indexOf(fromId);
    const to = next.indexOf(toId);
    if (from === -1 || to === -1) return ids;
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    return next;
  };

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnter = (e, overId) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    setOrderIds((prev) => {
      const next = moveId(prev, dragId, overId);
      if (next !== prev) setDirty(true);
      return next;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (!dirty) {
      setDragId(null);
      return;
    }
    const oldSorts = ordered.map((x) => x.sortIndex ?? 0);
    const payload = orderIds.map((id, i) => ({ id, sortIndex: oldSorts[i] ?? i }));
    dispatch(reorderStaffAsync(payload));
    setDragId(null);
    setDirty(false);
  };

  const toggleCategory = (cat) => {
    const key = CAT_KEYS[cat];
    const nextVal = !staffCats[key];
    dispatch(updateStaffCategoryToggleAsync({ key, value: nextVal }));
  };

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Сотрудники</div>
        </div>
        <div className={styles.card_components_admin__buttonFilter}>
          {CATEGORY_OPTIONS.map((cat, i) => {
            const key = CAT_KEYS[cat];
            const disabled = !!staffCats[key];
            return (
              <div className={styles.buttonFilterItem} key={cat}>
                <button
                  className={`${styles.card_components_admin__buttonFilter__group} ${
                    activeIdx === i ? styles.activeButtonVacancy : ''
                  } ${i === 0 ? styles.noAnimation : ''}`}
                  onClick={() => handleFilterClick(i)}
                  disabled={disabled}
                  style={{ paddingRight: 64, opacity: disabled ? 0.5 : 1 }}>
                  {cat}
                </button>

                <Toggle
                  on={disabled}
                  onClick={() => toggleCategory(cat)}
                  style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)' }}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.card_components_admin__button_block} onClick={openAddModal}>
          <button className={styles.card_components_admin__button}>
            <div>
              <svg
                className={styles.card_components_admin__icon}
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g>
                  <circle cx="20.5" cy="20" r="20" fill="#F6F6F6" />
                  <path
                    d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                    stroke="#75BBFD"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </g>
              </svg>
            </div>
            <div className={styles.card_components_admin__button_text}>Добавить сотрудника</div>
          </button>
        </div>

        {isModalOpen && (
          <div className={styles.card_components_admin__modal_container}>
            <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
              <StaffForm initial={editData} onClose={closeModal} />
              <button className={styles.card_components_admin__close_button} onClick={closeModal} />
            </div>
          </div>
        )}

        {error ? (
          <div className={styles.card_components_admin__errore_div}>Ошибка: {String(error)}</div>
        ) : loading ? (
          <div className={styles.card_components_admin__null_project}>Загрузка…</div>
        ) : !orderIds.length ? (
          <div className={styles.card_components_admin__null_project}>Сотрудников пока нет.</div>
        ) : (
          <div
            className={styles.card_components_admin__block_map}
            onDragOver={handleDragOver}
            onDrop={handleDragEnd}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: '24px',
              alignItems: 'start',
              cursor: dragId ? 'grabbing' : 'grab',
            }}>
            {orderIds.map((id) => {
              const el = ordered.find((x) => x.id === id);
              if (!el) return null;

              const isHidden = el.isVisible === false;
              const isDragging = dragId === el.id;

              return (
                <React.Fragment key={el.id}>
                  <div
                    className={styles.cart_project_container}
                    draggable
                    onDragStart={(e) => handleDragStart(e, el.id)}
                    onDragEnter={(e) => handleDragEnter(e, el.id)}
                    onDragEnd={handleDragEnd}
                    style={{ width: '100%', opacity: isDragging ? 0.6 : 1, transition: 'opacity 120ms ease' }}>
                    <div className={styles.cart_project_container__imageContainer}>
                      <img
                        className={styles.cart_project_container__img}                   
                        loading="lazy"
                        src={photoSrc(el)}
                        alt={el.name || 'staff'}
                      />

                      {canDelete && (
                        <div className={styles.del_block} style={{ right: '120px' }}>
                          <button className={styles.buttom_del} onClick={() => openDeleteModal(el.id)}>
                            <label className={styles.label}>
                              <div className={styles.wrapper}>
                                <div className={styles.lid}>
                                  <div className={styles.container_vedro}>
                                    <div className={styles.triangle_left}></div>
                                    <div className={styles.rectangle}></div>
                                    <div className={styles.triangle_right}></div>
                                  </div>
                                </div>
                                <div className={styles.can}></div>
                                <span>delete</span>
                              </div>
                            </label>
                          </button>
                        </div>
                      )}

                      {canToggle && (
                        <div
                          className={`${styles.look_block} ${isHidden ? styles.disabled : ''}`}
                          onClick={() => handleLookClick(el)}
                          style={{ right: '70px' }}>
                          <button className={styles.buttom_look}>
                            <label className={styles.label}>
                              <div className={styles.wrapper}>
                                <img src={isHidden ? NoLook : Look} alt={isHidden ? 'No look' : 'Look'} />
                              </div>
                            </label>
                          </button>
                        </div>
                      )}

                      {canEdit && (
                        <div className={styles.edit_block} onClick={() => openEditModal(el)}>
                          <button className={styles.buttom_edit}>
                            <label className={styles.label}>
                              <div className={styles.wrapper}>
                                <img src={Edit} alt="edit" />
                              </div>
                            </label>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.cart_project_container__content}>
                      <span className={styles.cart_project_container__title}>
                        {el.name}
                        {el.position ? ` — ${el.position}` : ''}
                      </span>
                    </div>
                  </div>

                  {deleteModalState[el.id] && (
                    <div className={styles.delete_modal_container}>
                      <div className={styles.delete_modal_block}>
                        <div className={styles.delete_modal_block__title}>
                          Вы точно хотите удалить карточку <br /> «{el.name}»?
                        </div>
                        <p className={styles.delete_modal_block__text}>Удаленную карточку нельзя будет вернуть</p>
                        <div className={styles.button_block}>
                          <button
                            className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                            onClick={() => closeDeleteModal(el.id)}
                          />
                          <button
                            className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                            onClick={() => confirmDelete(el.id)}
                          />
                        </div>
                        <button
                          className={styles.card_components_admin__close_button}
                          onClick={() => closeDeleteModal(el.id)}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
