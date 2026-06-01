import { UiMarksFilterTab } from '../../UI';
import s from '../styles/Toolbar.module.css';

export default function FilterToolbar({ tabs = [], activeTab, onTabChange }) {
    return (
      <div className={s.wrap}>
        {tabs.map((tab) => (
          <UiMarksFilterTab
            key={tab}
            label={tab}
            option="tab"
            isActive={activeTab === tab}
            onClick={() => onTabChange?.(tab)}
          />
        ))}
      </div>
    );
}
