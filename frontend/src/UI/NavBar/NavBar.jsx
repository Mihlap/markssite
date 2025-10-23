import { useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useNavLinks } from './hooks/useNavLinks';

import styles from './style.module.scss';
import Logo from './Logo';
gsap.registerPlugin(useGSAP);

const NavBar = () => {
  const navigate = useNavigate();
  const [linkChildren, setLinkChildren] = useState(false);
  const [openId, setOpenId] = useState(null);
  const { primary, cta } = useNavLinks();

  const container = useRef();
  const pendingOpenId = useRef(null); // когда переключаемся между дропами: сюда кладём id, который откроем после закрытия текущего

  const activeChildren = primary.find((i) => i.id === openId)?.children ?? [];

  // const cachedFn = useCallback(fn, dependencies);
  const handlerLink = (path) => {
    if (!path) return;
    if (!container.current) return;

    gsap.to(container.current, {
      y: -100,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(container.current, { display: 'none' });
        setLinkChildren(false);
        setOpenId(null);
        navigate(path);
      },
    });
  };

  useGSAP(() => {
    if (!container.current) return;
    // Скрываем блок по умолчанию, держим его в DOM
    gsap.set(container.current, { display: 'none', y: -100, autoAlpha: 0 });
  }, []);

  useGSAP(
    () => {
      if (!container.current) return;

      if (linkChildren) {
        // Показать и опустить вниз
        gsap.set(container.current, {
          display: 'block',
          height: `${openId === 3 ? '156px' : '200px'}`,
        });
        gsap.fromTo(
          container.current,
          { y: -100, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        // Спрятать с подъёмом вверх
        gsap.to(container.current, {
          y: -100,
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(container.current, { display: 'none' });
            // Если запланирован другой дроп — открываем его после закрытия текущего
            if (pendingOpenId.current != null) {
              const nextId = pendingOpenId.current;
              pendingOpenId.current = null;
              // сначала переключаем контент...
              setOpenId(nextId);
              // ...а затем запускаем открытие
              setLinkChildren(true);
            }
          },
        });
      }
    },
    { dependencies: [linkChildren, openId] }
  );

  return (
    <nav className={styles['navbar']}>
      <div className={styles['navbar-top']}>
        <Logo />
        <ul className={styles['navbar-list']}>
          {primary.map((item) => {
            if (item.children) {
              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  <button
                    className={styles['button']}
                    onClick={() => {
                      if (openId === item.id) {
                        // Клик по открытому пункту — просто закрываем
                        pendingOpenId.current = null;
                        setOpenId(null);
                        setLinkChildren(false);
                      } else if (linkChildren) {
                        // Уже открыт другой пункт — сперва закрываем текущий и планируем открыть новый
                        pendingOpenId.current = item.id;
                        setLinkChildren(false);
                      } else {
                        // Сейчас всё закрыто — сразу открываем выбранный
                        pendingOpenId.current = null;
                        setOpenId(item.id);
                        setLinkChildren(true);
                      }
                    }}>
                    {item.label}
                  </button>
                  {/* {linkChildren && (
                    <ul
                      style={{
                        position: 'fixed',
                        zIndex: 9999,
                        top: '100px',
                      }}>
                      {item.children?.map((el) => (
                        <li>{el.label}</li>
                      ))}
                    </ul>
                  )} */}
                </div>
              );
            } else {
              return (
                <li className={styles['navbar-item']} key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={() => handlerLink(item.path)}
                    className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}
                    end>
                    {item.label}
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
        <div className={styles['navbar-cta']}>
          {cta.map(({ id, label, path, external, variant }) => {
            const baseClasses = clsx(styles['navbar-link'], variant && styles[`navbar-link--${variant}`]);
            return external ? (
              <a key={id} href={path} className={styles['navbar-item-en']} target="_blank" rel="noreferrer">
                {label}
              </a>
            ) : (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) => clsx(baseClasses, isActive && styles['navbar-link--active'])}>
                {label}
              </NavLink>
            );
          })}
        </div>
      </div>
      <div ref={container} className={styles['navbar-children']}>
        {activeChildren.length > 0 && (
          <ul id="list" role="menu">
            {activeChildren.map((el) => (
              <li key={el.id} role="menuitem">
                {el.label}
                <div>{el.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
