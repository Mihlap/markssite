export default function ConstructorSection({
  styles,
  blocks,
  renderInputs,
  openConstructor,
  handlerOpenConstructor,
  ConstructorPage,
  handleClick,
}) {
  return (
    <>
      <div className={styles.inputs_container}>
        {blocks.map((blockInputs, blockIndex) => (
          <div key={blockIndex} className={styles.inputBlock}>
            {renderInputs(blockInputs, blockIndex)}
          </div>
        ))}
      </div>
      <div className={styles.constructor_container}>
        <div className={styles.constructor_container__block}>
          {!openConstructor ? (
            <div className={styles.constructor_container__block_btn}>
              <button type="button" onClick={handlerOpenConstructor}>
                <svg
                  className={styles.constructor_container__svg}
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <circle cx="20.5" cy="20" r="20" fill="#FF7F6A" />
                    <path
                      d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                      stroke="#F6F6F6"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </g>
                </svg>
              </button>
              <div className={styles.constructor_container__text}>Добавить блок из библиотеки</div>
            </div>
          ) : (
            <ConstructorPage handleClick={handleClick} />
          )}
        </div>
      </div>
    </>
  );
}
