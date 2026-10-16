/** Decorative phone. The real tip stays in the article; this mock is hidden from assistive tech. */
export function PhoneMock({ title }: { title: string }) {
  return (
    <div className="phone-stage" aria-hidden="true">
      <div className="phone">
        <div className="phone-notch" />
        <p className="phone-kicker">Notes</p>
        <p className="phone-title">{title}</p>
        <p className="phone-line">
          Meet me at the cafe at 7
          <i className="caret-inline" />
        </p>
        <div className="kb">
          <div className="kb-row">
            {Array.from({ length: 10 }, (_, index) => (
              <span key={index} className="key" />
            ))}
          </div>
          <div className="kb-row">
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className="key" />
            ))}
          </div>
          <div className="kb-row">
            <span className="key key-fn" />
            <span className="key key-space" />
            <span className="key key-fn" />
          </div>
        </div>
      </div>
    </div>
  );
}
