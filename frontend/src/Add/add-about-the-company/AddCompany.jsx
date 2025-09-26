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

import FormAddStaff from './FormAddEditStaff/FormAddStaff';
import Edit from '../icon/Edit.svg';
import Look from '../icon/eye.svg';
import NoLook from '../icon/eye2.svg';
import defaultPhoto from '../../img/default-photo.jpeg';
import cursorPng from '../img/cursor.png';
import dragDrop from '../icon/drag&drop.svg';

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
      }}>
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
  const [hoverId, setHoverId] = useState(null);
  const closeGuardRef = useRef(null);

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

  const enabledCats = useMemo(() => CATEGORY_OPTIONS.filter((c) => !!staffCats[CAT_KEYS[c]]), [staffCats]);

  useEffect(() => {
    const current = CATEGORY_OPTIONS[activeIdx];
    if (!staffCats[CAT_KEYS[current]]) {
      if (enabledCats.length) {
        const idx = CATEGORY_OPTIONS.findIndex((c) => c === enabledCats[0]);
        setActiveIdx(idx === -1 ? 0 : idx);
      }
    }
  }, [staffCats, activeIdx, enabledCats]);

  const currentCategory = CATEGORY_OPTIONS[activeIdx];

  const photoSrc = (row) => {
    const name = row?.img;
    if (!name) return defaultPhoto;
    if (/^https?:\/\//i.test(String(name))) return name;
    return `${bucket_url}/images/imageStuff/${name}`;
  };

  const filtered = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    const selected = currentCategory;
    const synonyms = CAT_EQUIV[selected] || [selected];
    const norm = (s) =>
      String(s || '')
        .toLowerCase()
        .trim();
    return list
      .map((it) => ({
        ...it,
        visibilityByCategory:
          it.visibilityByCategory && typeof it.visibilityByCategory === 'object' ? it.visibilityByCategory : {},
      }))
      .filter((it) => (it.category || []).some((c) => synonyms.map(norm).includes(norm(c))));
  }, [items, currentCategory]);

  const ordered = useMemo(() => {
    const arr = filtered.map((it) => ({
      ...it,
      isVisible: typeof it.isVisible === 'boolean' ? it.isVisible : true,
    }));
    arr.sort(
      (a, b) =>
        (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return arr;
  }, [filtered]);

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
      const perCat = row.visibilityByCategory || {};
      const current = perCat[currentCategory] ?? true;
      dispatch(
        toggleVisibilityStaffAsync({
          id: row.id,
          isVisible: !current,
          category: currentCategory,
        })
      );
    },
    [dispatch, currentCategory]
  );

  // const handleFilterClick = (index) => {
  //   const cat = CATEGORY_OPTIONS[index];
  //   const key = CAT_KEYS[cat];
  //   if (!staffCats[key]) return;
  //   setActiveIdx(index);
  // };

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

  const byId = useMemo(() => {
    const m = new Map();
    for (const it of ordered) m.set(it.id, it);
    return m;
  }, [ordered]);

  const noEnabledCats = enabledCats.length === 0;

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Сотрудники</div>
        </div>

        <div className={styles.card_components_admin__buttonFilter}>
          <div className={styles.buttonFilterStrip}>
            {CATEGORY_OPTIONS.map((cat, i) => {
              const key = CAT_KEYS[cat];
              const isEnabled = !!staffCats?.[key];
              const isActive = isEnabled && activeIdx === i;

              const btnStyle = isEnabled
                ? { paddingRight: 16, cursor: 'pointer' }
                : {
                    paddingRight: 16,
                    background: 'var(--light-light-gray-EBECEE)',
                    color: 'var(--gray-959DA6)',
                    transition: 'none',
                  };

              return (
                <div className={styles.buttonFilterItem} key={cat}>
                  <button
                    type="button"
                    className={`${styles.card_components_admin__buttonFilter__group} ${
                      isActive ? styles.activeButtonVacancy : ''
                    }`}
                    aria-disabled={!isEnabled}
                    data-disabled={!isEnabled}
                    style={btnStyle}
                    onClick={() => {
                      if (isEnabled) setActiveIdx(i);
                    }}
                    onMouseEnter={(e) => {
                      if (!isEnabled) {
                        e.currentTarget.style.background = 'var(--light-light-gray-EBECEE)';
                        e.currentTarget.style.color = 'var(--gray-959DA6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isEnabled) {
                        e.currentTarget.style.background = 'var(--light-light-gray-EBECEE)';
                        e.currentTarget.style.color = 'var(--gray-959DA6)';
                      }
                    }}>
                    <span className={styles.buttonText}>{cat}</span>

                    <Toggle on={isEnabled} onClick={() => toggleCategory(cat)} style={{ marginLeft: 'auto' }} />
                  </button>
                </div>
              );
            })}
          </div>
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
              <FormAddStaff
                initial={editData}
                onClose={closeModal}
                registerCloseGuard={(fn) => (closeGuardRef.current = fn)}
                currentCategory={currentCategory}
              />         
            </div>
          </div>
        )}

        {error ? (
          <div className={styles.card_components_admin__errore_div}>Ошибка: {String(error)}</div>
        ) : loading ? (
          <div className={styles.card_components_admin__null_project}>Загрузка…</div>
        ) : noEnabledCats ? (
          <div className={styles.card_components_admin__null_project}>Все категории выключены.</div>
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
            }}>
            {orderIds.map((id) => {
              const el = byId.get(id);
              if (!el) return null;

              const perCat = el.visibilityByCategory || {};
              const isHiddenInCurrent = (perCat[currentCategory] ?? true) === false;
              const isDragging = dragId === el.id;

              return (
                <React.Fragment key={el.id}>
                  <div
                    className={styles.cart_project_container}
                    draggable
                    onDragStart={(e) => handleDragStart(e, el.id)}
                    onDragEnter={(e) => handleDragEnter(e, el.id)}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={() => setHoverId(el.id)}
                    onMouseLeave={() => setHoverId((p) => (p === el.id ? null : p))}
                    style={{
                      position: 'relative',
                      width: '100%',
                      opacity: isDragging ? 0.6 : 1,
                      transition: 'opacity 120ms ease',
                      ...(hoverId === el.id && !dragId ? { cursor: `url(${cursorPng}) 12 12, pointer` } : {}),
                    }}>
                    {hoverId === el.id && !dragId && (
                      <img
                        src={dragDrop}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 18,
                          zIndex: 3,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}
                      />
                    )}
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
                          className={`${styles.look_block} ${isHiddenInCurrent ? styles.disabled : ''}`}
                          onClick={() => handleLookClick(el)}
                          style={{ right: '70px' }}>
                          <button className={styles.buttom_look}>
                            <label className={styles.label}>
                              <div className={styles.wrapper}>
                                <img
                                  src={isHiddenInCurrent ? NoLook : Look}
                                  alt={isHiddenInCurrent ? 'No look' : 'Look'}
                                />
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
                          Вы точно хотите удалить <br />
                          сотрудника «{el.name}»?
                        </div>
                        <p className={styles.delete_modal_block__text}>
                          Если вы удалите информацию о сотруднике, вернуть <br />
                          ее будет невозможно
                        </p>
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
