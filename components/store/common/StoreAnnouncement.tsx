import styled from 'styled-components';

type Props = {
  text: string;
};

// A store's announcement, as the dashboard (or a direct update) saved it.
// Plain text: line breaks are kept, nothing else is interpreted. Styled to
// match the store homepage's close-date banner, which it sits under.
export default function StoreAnnouncement(props: Props) {
  return (
    <StoreAnnouncementStyles>
      <p>{props.text}</p>
    </StoreAnnouncementStyles>
  );
}

const StoreAnnouncementStyles = styled.div`
  margin: 0 auto;
  padding: 0.6875rem 1.625rem;
  max-width: 40rem;
  width: 100%;
  background-color: #eff6ff;
  border: 2px solid #dbeafe;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  /* Doubled so the page's own p rules don't win. */
  && p {
    margin: 0;
    padding: 0;
    max-width: none;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1e3a8a;
    text-align: center;
    line-height: 1.5;
    white-space: pre-line;
  }
`;
