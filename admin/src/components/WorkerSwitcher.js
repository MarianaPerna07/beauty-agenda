// src/components/WorkerSwitcher.js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../AuthContext";

const useStyles = makeStyles(() => ({
  iconBtn: {
    padding: 4,
    marginLeft: 6,
    color: "#5c7160",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#a5bf99",
  },
  menuPaper: {
    borderRadius: 12,
  },
}));

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function WorkerSwitcher({ anchorAlignment = "right" }) {
  const classes = useStyles();
  const { selectedWorker, setSelectedWorker } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/workers");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setWorkers(Array.isArray(data.workers) ? data.workers : []);
      } catch (e) {
        console.error("Failed to load workers:", e);
        if (mounted) setWorkers([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const choose = (w) => {
    setSelectedWorker({
      worker_id: w.worker_id,
      name: w.name || "Profissional",
      email: w.email || "",
    });
    handleClose();
  };

  return (
    <>
      <Tooltip title="Trocar profissional">
        <IconButton className={classes.iconBtn} onClick={handleOpen} size="small" aria-label="Trocar profissional">
          {/* chevron minimalista */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: anchorAlignment }}
        transformOrigin={{ vertical: "top", horizontal: anchorAlignment }}
        classes={{ paper: classes.menuPaper }}
      >
        {workers.map((w) => {
          const active = selectedWorker?.worker_id === w.worker_id;
          return (
            <MenuItem key={w.worker_id} onClick={() => choose(w)} selected={active}>
              <ListItemIcon>
                {/* bolinha no mesmo verde da identidade */}
                <span className={classes.dot} />
              </ListItemIcon>
              <ListItemText
                primary={w.name}
                secondary={w.email || null}
                primaryTypographyProps={{ style: { color: "#415140", fontWeight: 500 } }}
                secondaryTypographyProps={{ style: { color: "rgba(92,113,96,.7)" } }}
              />
              {/* iniciais à direita, discreto */}
              <div style={{
                marginLeft: 8,
                padding: "2px 8px",
                borderRadius: 999,
                background: active ? "rgba(165,191,153,0.2)" : "rgba(92,113,96,0.06)",
                color: "#5c7160",
                fontSize: 12,
                fontWeight: 600
              }}>
                {initials(w.name)}
              </div>
            </MenuItem>
          );
        })}
        {workers.length === 0 && (
          <MenuItem disabled>Sem profissionais</MenuItem>
        )}
      </Menu>
    </>
  );
}

WorkerSwitcher.propTypes = {
  anchorAlignment: PropTypes.oneOf(["left", "right"]),
};
