import { useEffect, useRef } from 'react';
import { UiMarksTextBox } from '../../UI';
import { cityData, secondaryContacts } from '../const';
import FilterToolbar from './FilterToolbar';
import s from '../styles/Info.module.css';

const tabs = cityData.map((c) => c.name);

export default function Info({ activeCity, onCityChange, onOverlayResize }) {
  const wrapIntoRef = useRef(null);
  const wrapRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const element = wrapIntoRef.current;
    if (!element || !onOverlayResize) return undefined;

    const reportInsets = () => {
      const wrapEl = wrapRef.current;
      const toolbarEl = toolbarRef.current;
      if (!wrapEl) return;

      const isMobileLayout = window.innerWidth <= 430;

      if (isMobileLayout) {
        onOverlayResize({
          top: wrapEl.getBoundingClientRect().height,
          bottom: toolbarEl?.getBoundingClientRect().height ?? 0,
        });
        return;
      }

      onOverlayResize({
        top: element.getBoundingClientRect().height,
        bottom: 0,
      });
    };

    reportInsets();

    const observer = new ResizeObserver(reportInsets);
    observer.observe(element);
    if (wrapRef.current) observer.observe(wrapRef.current);
    if (toolbarRef.current) observer.observe(toolbarRef.current);

    return () => observer.disconnect();
  }, [onOverlayResize, activeCity]);

  return (
    <section ref={wrapIntoRef} className={s.wrapInto}>
      <div ref={wrapRef} className={s.wrap}>
        <UiMarksTextBox
          variant="h1"
          size="5xl"
          mobileSize="4xl"
          bigSize="6xl"
          weight="300"
          color="primary"
          font="unbounded"
          className={s.title}>
          Контакты
        </UiMarksTextBox>

        <div className={s.wrapContent}>
          <div className={s.wrapLeft}>
            <div className={s.wrapTender}>
              <UiMarksTextBox
                variant="p"
                size="xl"
                mobileSize="md"
                bigSize="2xl"
                weight="300"
                color="primary"
                font="unbounded"
                className={s.tenderLabel}>
                По вопросам тендеров и коммерческих
                <br />
                предложений (для заказчиков)
              </UiMarksTextBox>
              <UiMarksTextBox
                variant="a"
                size="4xl"
                mobileSize="xl"
                bigSize="4_5xl"
                weight="400"
                color="primary"
                font="unbounded"
                href="mailto:tender@marksgroup.ru"
                className={s.email}>
                tender@marksgroup.ru
              </UiMarksTextBox>
            </div>

            <div className={s.wrapContact}>
              {activeCity.phone && (
                <UiMarksTextBox
                  variant="a"
                  size="2xl"
                  mobileSize="xl"
                  bigSize="4xl"
                  weight="300"
                  color="primary"
                  font="unbounded"
                  href={`tel:${activeCity.phone}`}
                  className={s.phone}>
                  {activeCity.phone}
                </UiMarksTextBox>
              )}
              <div className={s.addressBlock}>
                <UiMarksTextBox
                  variant="p"
                  size="md"
                  bigSize="lg"
                  weight="400"
                  color="primary"
                  font="raleway"
                  className={s.address}>
                  {activeCity.address}
                </UiMarksTextBox>
                <div className={s.hours}>
                  <UiMarksTextBox
                    variant="p"
                    size="sm"
                    bigSize="md"
                    weight="400"
                    color="muted"
                    mobileColor="secondary"
                    font="raleway"
                    className={s.hoursText}>
                    Режим работы
                  </UiMarksTextBox>
                  <span className={s.hoursDot} aria-hidden="true" />
                  <UiMarksTextBox
                    variant="p"
                    size="sm"
                    bigSize="md"
                    weight="400"
                    color="muted"
                    mobileColor="secondary"
                    font="raleway"
                    className={s.hoursText}>
                    Пн.—Пт. 10.00—19.00
                  </UiMarksTextBox>
                  {activeCity.hour && (
                    <>
                      <span className={s.hoursDot} aria-hidden="true" />
                      <UiMarksTextBox
                        variant="p"
                        size="sm"
                        bigSize="md"
                        weight="400"
                        color="muted"
                        mobileColor="secondary"
                        font="raleway"
                        className={s.hoursText}>
                        {activeCity.hour}
                      </UiMarksTextBox>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={s.wrapRight}>
            {secondaryContacts.map(({ email, description }) => (
              <div key={email} className={s.wrapSecondary}>
                <UiMarksTextBox
                  variant="a"
                  size="md"
                  bigSize="lg"
                  weight="700"
                  color="primary"
                  font="raleway"
                  href={`mailto:${email}`}
                  className={`${s.point} ${s.secondaryEmail}`}>
                  {email}
                </UiMarksTextBox>
                <UiMarksTextBox
                  variant="p"
                  size="md"
                  bigSize="lg"
                  weight="400"
                  color="primary"
                  font="raleway"
                  className={s.secondaryDescription}>
                  {email === 'pr@marksgroup.ru' ? (
                    <>
                      По вопросам PR, публикаций в СМИ,
                      <br />
                      участия в конференциях
                    </>
                  ) : (
                    description
                  )}
                </UiMarksTextBox>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={toolbarRef} className={s.toolbarSlot}>
        <FilterToolbar
          tabs={tabs}
          activeTab={activeCity.name}
          onTabChange={(name) => onCityChange(cityData.find((c) => c.name === name))}
        />
      </div>
    </section>
  );
}
