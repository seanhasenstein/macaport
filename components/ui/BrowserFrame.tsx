import styled from 'styled-components';
import { theme } from '../../styles/theme';

type Props = {
  /** Path under /public. Omit to render the placeholder. */
  src?: string;
  alt?: string;
  /** Intrinsic pixel size of the screenshot, so the frame reserves space. */
  width?: number;
  height?: number;
  /** Shown in the frame's address bar. */
  label: string;
  /** Describes what belongs here while the screenshot is missing. */
  placeholder?: string;
};

// Wraps product screenshots in browser chrome. Raw screenshots read as
// documentation; framed ones read as product marketing.
//
// Renders a placeholder when `src` is missing so the layout is final before
// the screenshots exist. Dropping them in later is an asset change, not a
// layout change.
export default function BrowserFrame({
  src,
  alt = '',
  width,
  height,
  label,
  placeholder,
}: Props) {
  return (
    <FrameStyles>
      <div className="chrome">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="address">{label}</span>
      </div>
      <div className="viewport">
        {src ? (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="placeholder">
            <span>{placeholder ?? 'Screenshot coming soon'}</span>
          </div>
        )}
      </div>
    </FrameStyles>
  );
}

const FrameStyles = styled.div`
  width: 100%;
  background-color: ${theme.color.surface};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04), 0 24px 48px -24px rgb(0 0 0 / 0.24);
  overflow: hidden;

  .chrome {
    padding: 0.6875rem 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: ${theme.color.surfaceMuted};
    border-bottom: 1px solid ${theme.color.border};
  }

  .dots {
    display: flex;
    gap: 0.375rem;
    flex-shrink: 0;

    i {
      height: 0.625rem;
      width: 0.625rem;
      display: block;
      background-color: ${theme.color.border};
      border-radius: 50%;
    }
  }

  .address {
    padding: 0.1875rem 0.625rem;
    flex: 1 1 0%;
    min-width: 0;
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.border};
    border-radius: 999px;
    font-size: 0.75rem;
    color: ${theme.color.textSubtle};
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .viewport {
    display: block;
    background-color: ${theme.color.surface};

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .placeholder {
    padding: 1.5rem;
    min-height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: ${theme.color.surfaceMuted};
    background-image: radial-gradient(
      ${theme.color.border} 1px,
      transparent 1px
    );
    background-size: 20px 20px;

    span {
      padding: 0.5rem 0.875rem;
      max-width: 22rem;
      background-color: ${theme.color.surface};
      border: 1px solid ${theme.color.border};
      border-radius: 999px;
      font-size: 0.8125rem;
      color: ${theme.color.textMuted};
    }
  }

  @media (max-width: 600px) {
    .placeholder {
      min-height: 13rem;
    }
  }
`;
