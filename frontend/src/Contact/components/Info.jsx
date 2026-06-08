import React, { useRef, useEffect } from 'react';
import { UiMarksTextBox } from '../../UI';
import { cityData } from '../const';
import FilterToolbar from './FilterToolbar';
import s from '../styles/Info.module.css';

const tabs = cityData.map((c) => c.name);

export default function Info({ activeCity, onCityChange }) {
  return (
    <section className={s.wrapInto}>
      <div className={s.wrap}>
        <UiMarksTextBox
          variant="h1"
          size="5xl"
          mobileSize="4xl"
          bigSize="6xl"
          weight="300"
          color="primary"
          font="unbounded">
          Контакты
        </UiMarksTextBox>

        <div className={s.wrapContent}>
          <div className={s.wrapLeft}>
            <div className={s.wrapEmail}>
              <UiMarksTextBox
                variant="p"
                size="xl"
                mobileSize="md"
                bigSize="2xl"
                weight="300"
                color="primary"
                font="unbounded">
                Стать клиентом
              </UiMarksTextBox>
              <UiMarksTextBox
                variant="a"
                size="3xl"
                mobileSize="2xl"
                bigSize="4_5xl"
                weight="400"
                color="primary"
                font="unbounded"
                href="mailto:mail@marksgroup.ru"
                className={s.email}>
                mail@marksgroup.ru
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
                  href={`tel:${activeCity.phone}`}>
                  {activeCity.phone}
                </UiMarksTextBox>
              )}
              <span>
                <UiMarksTextBox
                  variant="p"
                  size="md"
                  bigSize="lg"
                  weight="400"
                  color="primary"
                  font="raleway">
                  {activeCity.address}
                </UiMarksTextBox>
                {activeCity.hour && (
                  <UiMarksTextBox
                    variant="p"
                    size="sm"
                    bigSize="md"
                    weight="400"
                    color="muted"
                    mobileColor="secondary"
                    font="raleway">
                    Режим работы · Пн.—Пт. 10.00—19.00 · {activeCity.hour}
                  </UiMarksTextBox>
                )}
              </span>
            </div>
          </div>

          <div className={s.wrapRight}>
            <div className={s.wrapPr}>
              <UiMarksTextBox
                variant="a"
                size="md"
                bigSize="lg"
                weight="700"
                color="primary"
                font="raleway"
                href="mailto:pr@marksgroup.ru"
                className={s.point}>
                pr@marksgroup.ru
              </UiMarksTextBox>
              <UiMarksTextBox
                variant="p"
                size="md"
                bigSize="lg"
                weight="400"
                color="primary"
                font="raleway">
                По вопросам PR, публикаций в СМИ,
                <br /> участия в конференциях
              </UiMarksTextBox>
            </div>

            <div className={s.wrapTender}>
              <UiMarksTextBox
                variant="a"
                size="md"
                bigSize="lg"
                weight="700"
                color="primary"
                font="raleway"
                href="mailto:tender@marksgroup.ru"
                className={s.point}>
                tender@marksgroup.ru
              </UiMarksTextBox>
              <UiMarksTextBox
                variant="p"
                size="md"
                bigSize="lg"
                weight="400"
                color="primary"
                font="raleway">
                По вопросам тендеров и коммерческих
                <br /> предложений
              </UiMarksTextBox>
            </div>
          </div>
        </div>
      </div>

      <FilterToolbar
        tabs={tabs}
        activeTab={activeCity.name}
        onTabChange={(name) => onCityChange(cityData.find((c) => c.name === name))}
      />
    </section>
  );
}
